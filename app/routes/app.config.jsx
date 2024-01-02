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
  // const responseShop = updateStoreUrl(shop);
  // if (responseShop == 0) {
    try {
      console.log("inputToken", token);
      console.log("nombreTienda", shop);

      const nuevoToken = await prisma.token.create({
        data: {
          token: token,
          nombreTienda: shop
        }
      });
      console.log('Token creado:', nuevoToken);
    } catch (error) {
      console.error('Error al crear datos de prueba:', error);
    }

 // }
  return {"test":"efef"}
};



export const loader = async ({ request }) => {

  if (request.method === 'POST') {
     }
    console.log('Token recibido:',request.method);
    // Devolver una respuesta al cliente si es necesario
  

  var m = await authenticate.admin(request);


  const shop = m.session.shop;
  console.log("el valor de auth es;", m.session.shop);
  var posts = await prisma.token.findMany({
    where: {
      nombreTienda: shop,
    },
  });
  console.log("Token encontrado;", posts);

  return { posts, shop };
};


const updateStoreUrl = async ({store_url,inputToken}) => {
  try {
    const response = await fetchData(`${generalServerApi}/api/integrations/put-integrations-url-store`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${inputToken}`
      },
      body: JSON.stringify({ "store_url": store_url })
    });

    if (!response.ok) {
      return 1

    }


    return 0;
  } catch (error) {
    return 2
  }
}


export default function Configs() {
  const submit = useSubmit();

  const { posts } = useLoaderData();
  const { shop } = useLoaderData();
  const [inputToken, setInputToken] = useState("");

  // const hasPosts = Array.isArray(posts) && posts.length > 0;

  const saveToken = async () => {
     
    //  var isEdited= await updateStoreUrl(shop,inputToken);
    //  console.log("aqui esta la respuesta",isEdited);
    //  console.log("este es el token",inputToken);
    //  console.log("esta es la tienda",shop);


    // if(isEdited===0){
      const response=  await submit({ token: inputToken }, { replace: true, method: "POST" })
       console.log("respuesta",response);
       shopify.toast.show("Se ha validado el token de autorizacion de easyecommerce");

    // } else{
    //   shopify.toast.show("No se encontro esta integracion");
    // }
  };


  const handleInputTokenChange = (value) => {
    setInputToken(value);
  };

  const handleDeleteClick = (id) => {
    // Suponiendo que tienes el ID del token almacenado en la variable `idTokenAEliminar`
    eliminarToken(id);
  };
  const handleSearchChange = (value) => {
    // Suponiendo que tienes el ID del token almacenado en la variable `idTokenAEliminar`
    setInputToken(value);
  };
  return (
    <Page>
      <ui-title-bar title="Configuraciones" />
      <Layout>
        <Layout.Section>
          {posts.length > 0 ? (
            <Card>
              <BlockStack gap="700">
                {/* <TextField
                label="Ingrese el nombre de tienda"
                placeholder="su tienda aqui"
              /> */}
                <TextField
                  label="Ingresar token easyecommerce"
                  placeholder="ingresar token aqui"
                  value={inputToken}
                  onChange={handleInputTokenChange}
                />

                <DataTable
                  columnContentTypes={[
                    'text', // Agregar una columna para la imagen
                    'text',
                    'button'

                  ]}
                  headings={[

                    'Store', // Encabezado de la columna de la imagen
                    'Token',


                  ]}
                  // Establecer estilos para cada fila de la tabla
                  style={{
                    tableLayout: 'fixed',
                    width: '100%',
                  }}
                  rows={posts.map(post => ([
                    <div style={{ display: 'flex', alignItems: 'center', maxWidth: '200px', maxHeight: '75px', overflow: 'hidden', wordWrap: 'break-word' }}>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {post.nombreTienda}
                      </div>
                    </div>,
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {`${post.token}`}
                    </div>,
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="danger" onClick={handleDeleteClick(post.id)}>
                        <FaTrash /> Eliminar
                      </Button>
                    </div>,


                  ]))}
                />



              </BlockStack>
            </Card>
          ) : (
            <Card>
              {/* <TextField
                label="Ingrese el nombre de tienda"
                placeholder="su tienda aqui"
              /> */}
              <TextField
                label="Ingresar token easyecommerce"
                placeholder="ingresar token aqui"
                value={inputToken}
                onChange={handleSearchChange}
              />
              <Button onClick={() => saveToken()}>Guardar token</Button>

            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}




