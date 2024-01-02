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
import { useEffect, useState } from "react";
import { authenticate, crearDatosDePrueba,consultarTokens,test } from "../shopify.server";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
// import {fetch} from 'node-fetch';
export const generalServerApi =
"https://easyecommercelaravel-production.up.railway.app";



 const getCategories=  (variant)=>{
  
  var arrayOptions=[];
        
           if('color' in variant){
             arrayOptions.push(variant['color']);
           }
           if('size' in variant){
             arrayOptions.push(variant['size']);
           }
           if('dimension' in variant){
             arrayOptions.push(variant['dimension']);
           }  
  //console.log("array options",arrayOptions);
   return arrayOptions; 
 }

export const action = async ({ request }) => {
  const { code } = request;
  // let formData =request.formData();
  const formData = Object.fromEntries(await request.formData());
  const { product } = formData;
  const newproduct = JSON.parse(formData.product)
console.log('Codigo:', request);


  const features = JSON.parse(newproduct.features);
  const variableArray = [];

  for (let index = 0; index < features.variants.length; index++) {
    variableArray.push( {
      "sku": features.variants[index].sku+ "C"+newproduct.product_id,
      "title": "Product"+index,
      "options": getCategories(features.variants[index] ),
      "price": newproduct.price,
      "inventoryQuantities": [
        {
          "availableQuantity": 233,
          "locationId": `gid://shopify/Location/72892154075`
        }
     ],
    },)
    
  }

  const getImages=(images,productId)=>{
    jsonImg= JSON.parse(images);
    var arrayImages=[];
 
     for (let index = 0; index < jsonImg.length; index++) {
      arrayImages.push({"altText": "img"+productId+index,
                          "src":    `https://api.easyecomerce.com${jsonImg[index]}`})
             
     }
     return arrayImages
    
  }


  const { admin } = await authenticate.admin(request);
  const color = ["ROJO", "Naranja", "Amarillo", "verde"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
     mutation populateProduct($input: ProductInput!) {
       productCreate(input: $input) {
         product {
           id
           title
           handle
           status
           variants(first: 10) {
             edges {
               node {
                 id
                 price
                 barcode
                 createdAt
                 
               }
             }
           }
         }
       }
     }`,
    {
      variables: {
        input: {
          title: newproduct.product_name,
          descriptionHtml:features.description,
          publications: [
            {
              "channelHandle": "",
              "channelId": "gid://shopify/Channel/112212345051",
              "publicationId": "gid://shopify/Publication/112212345051",
              "publishDate": new Date().toISOString()
            }
          ],
          "productCategory": {
            "productTaxonomyNodeId": "gid://shopify/ProductTaxonomyNode/"+features.categories[0].id
          },
          variants: variableArray,
          images:  getImages(newproduct.url_img, newproduct.id)
       

        },
      },
    }
  );
  const responseJson = await response.json();


  const response2 = await admin.graphql(
    `#graphql
   query
    {
      locations(first: 10) {
        edges {
          node {
            id
            name
            address {
              city
              country
              address1
              address2
            }
          }
        }
      }
    }
  `
  );

  const response4 = await admin.graphql(
    `#graphql
   query
    {
      publications(first: 10) {
        edges {
          node {
            id
          
          }
        }
      }
    }
  `
  );

  const responseJson2 = await response2.json();
  const response3 = await admin.graphql(
    `#graphql
   query
    {
      channels(first: 10) {
        edges {
          node {
            id
            name
         
          }
        }
      }
    }
  `
  );
 

  

  const responseJson3 = await response3.json();
  const responseJson4 = await response4.json();


  console.log("locaciones=", responseJson2.data.locations.edges)
  console.log("salesChanels=", responseJson3.data.channels.edges)
  //console.log("publications=", responseJson4.data.ProductTaxonomyNode.edges)


  return json({
    product: responseJson.data.productCreate.product,
  });
};

export const loader = async ({ request }) => {
  var m= await authenticate.admin(request);


  const shop =  m.session.shop;
  console.log("el valor de shop es;", shop);
  var posts = await prisma.token.findMany({
    where: {
      nombreTienda: shop,
    },
  });
  console.log("Token encontrado;", posts);

  return { posts, shop };
};


export default function Products() {

  const { posts } = useLoaderData();


  const [searchValue, setSearchValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [products, setProducts] = useState([]);
  const [showGenerateButton, setShowGenerateButton] = useState(true);

  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );



  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);




  const generateProduct = async (products) => {
    const firstProduct = products[0];
    await submit({ product: JSON.stringify(firstProduct) }, { replace: true, method: "POST" });
    setShowGenerateButton(false)
  };




  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  useEffect(() => {
    console.log("Estado de productos actualizado:", products);
  }, [products]);
 

  const loadData = async () => {
    try {
      const result = await fetchDataFromAPI(searchValue);
      setProducts([result]);
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
    }
  }
  const handleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  return (
    <Page>
      <ui-title-bar title="Importar productos" />
      <Layout>
        <Layout.Section>
        {posts.length > 0 ? (
          <Card>
            <BlockStack gap="700">
              <TextField
                label="Ingrese código(s) para buscar producto"
                placeholder="Ingrese el código..."
                value={searchValue}
                onChange={handleSearchChange}

              />
              {/* Contenedor para los botones */}
              <div style={{ display: 'flex', justifyContent: 'left', marginTop: '15px', marginBottom: '15px' }}>
                {/* Botón Buscar */}
                <Button primary onClick={() => loadData()}>
                  Buscar
                </Button>
                {/* Espacio entre los botones */}
                <div style={{ width: '10px' }}></div>
                {/* Botón Importar */}
                {showGenerateButton && (
                <Button loading={isLoading} onClick={() => generateProduct(products)}>
                  Importar
                </Button>
                  )}
                {actionData?.product && (
                  <Button
                    url={`shopify:admin/products/${productId}`}
                    target="_blank"
                    
                  >
                    Revisar
                  </Button>
                )}
              </div>

              <DataTable
                columnContentTypes={[
                  'checkbox',
                  'text', // Agregar una columna para la imagen
                  'text',
                  'numeric',
                  'text',
                ]}
                headings={[
                  '',
                  'Image', // Encabezado de la columna de la imagen
                  'Product',
                  'Price',
                  'Description',
                ]}
                // Establecer estilos para cada fila de la tabla
                style={{
                  tableLayout: 'fixed',
                  width: '100%',
                }}
                rows={products.map(product => ([
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      key={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                    />
                  </div>,
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={`https://api.easyecomerce.com${JSON.parse(product.url_img)[0]}`}
                      alt={`Imagen de ${product.product_name}`}
                      style={{ width: '75px', height: '75px' }}
                    />
                  </div>,
                  <div style={{ display: 'flex', alignItems: 'center', maxWidth: '200px', maxHeight: '75px', overflow: 'hidden', wordWrap: 'break-word' }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {product.product_name}
                    </div>
                  </div>,
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {`$${product.price}`}
                  </div>,
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {`$${product.stock}`}
                  </div>
                ]))}
              />



            </BlockStack>
          </Card>
           ) : (
            <Card>
                   <Text variant="bodyMd" as="p">
                    Porfavor completa el proceso de validacion de la aplicación en configuración
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </Link>{" "}
                   
                  </Text>


          </Card> )}
        </Layout.Section>
        {/* Resto del código Layout.Section se omite */}
      </Layout>
    </Page>

  );
}


export const importProduct = async ({ request }) => {
   

  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Tabla de cocina`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });

};

export const fetchDataFromAPI = async (id) => {
  try {
    const response = await fetch(`${generalServerApi}/api/products/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ "populate": "warehouse" }) 
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`There was a problem fetching data: ${error.message}`);
  }



}