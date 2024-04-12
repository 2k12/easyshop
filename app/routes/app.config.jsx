import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  TextField,
  Button,
  DataTable,
  Checkbox,
} from "@shopify/polaris";
import { useLoaderData, useSubmit } from "@remix-run/react";
import prisma from "../db.server";
import { useState } from "react";
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { generalServerApi } from "./app.product";
import { FaTrash } from 'react-icons/fa';
import { fetchData } from "@remix-run/react/dist/data";
import { ConfigurationsBlock } from "./embedded_blocks";



const eliminarToken = async (tokenID) => {
  try {
    await prisma.token.delete({
      where: {
        id: tokenID,
      },
    });

    console.log('Token eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
  } finally {
    await prisma.$disconnect();
  }
};



export const action = async ({ request }) => {

  const formData = Object.fromEntries(await request.formData());
  const { token } = formData;
  const url = new URL(request.url);

  var m = await authenticate.admin(request);
  const shop = m.session.shop;
  
    try {


      const nuevoToken = await prisma.token.create({
        data: {
          token: token,
          nombreTienda: shop
        }
      });
    } catch (error) {
      console.error('Error al crear datos de prueba:', error);
    }

 
  return {"test":"efef"}
};

const getToken=async (store_url)=>{
  try {
    const response = await fetch(`${generalServerApi}/api/integrations/get-integrations-url-store/get-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${inputToken}`
      },
      body: JSON.stringify({ "store_url": store_url })
    });

    if (!response.ok) {
      return 1

    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error
  }
}

export const loader = async ({ request }) => {

  if (request.method === 'POST') {
     }
  
  var m = await authenticate.admin(request);


  const shop = m.session.shop;
  var posts = await getToken(shop);

  return { posts, shop };
};


const updateStoreUrl = async (store_url,inputToken) => {
  try {


    var bearer="bearer "+inputToken;


    const response = await fetch(`${generalServerApi}/api/integrations/put-integrations-url-store/compare-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearer
      },
      body: JSON.stringify({ "store_url": store_url })
    });

    if (!response.ok) {
      const data = await response.json();

      return data

    }

    return 0;
  } catch (error) {
    return 2
  }
}


export default function Configs() {
  const submit = useSubmit();

  const { posts,shop } = useLoaderData();

  const [inputToken, setInputToken] = useState("");

  var rowData={};
  var headings =[];
  var rows =[];

  if(posts!==1){
   rowData = {
    store: posts.integration.store_url??"",
    token: posts.integration.token??"",
  };

  // Encabezados de la tabla
   headings = ['Store', 'Token'];

  // Filas de la tabla
   rows = [
    [
      <div style={{ whiteSpace: 'pre-wrap' }}>{rowData.store}</div>,
      <div style={{ whiteSpace: 'pre-wrap' }}>{rowData.token}</div>,
    ],
  ];

}
  // const hasPosts = Array.isArray(posts) && posts.length > 0;

 const saveToken = async () => {
     
     var isEdited= await updateStoreUrl(shop,inputToken);

    if(isEdited===0){

       shopify.toast.show("Se ha validado el token de autorizacion de easyecommerce");

    } else{
      shopify.toast.show("No se encontro esta integracion");
    }
 };

  const handleSearchChange = (value) => {
    // Suponiendo que tienes el ID del token almacenado en la variable `idTokenAEliminar`
    setInputToken(value);
  };
  return (
<ConfigurationsBlock
    posts={posts}
    shop={shop}
    inputToken={inputToken}
    handleSearchChange={handleSearchChange}
    saveToken={saveToken}
  />
  );
}




