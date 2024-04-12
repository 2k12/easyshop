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
import { authenticate, crearDatosDePrueba, consultarTokens, test } from "../shopify.server";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import { ImportProductsBlock } from "./embedded_blocks";
// import {fetch} from 'node-fetch';
export const generalServerApi =
  "https://devapi.easyecomerce.com/apitest/public/index.php";



const getCategories = (variant) => {

  var arrayOptions = [];

  if ('color' in variant) {
    arrayOptions.push(variant['color']);
  }
  if ('size' in variant) {
    arrayOptions.push(variant['size']);
  }
  if ('dimension' in variant) {
    arrayOptions.push(variant['dimension']);
  }
  //console.log("array options",arrayOptions);
  return arrayOptions;
}

export const action = async ({ request }) => {
  //   const { code } = request;
  //   // let formData =request.formData();
  //   const formData = Object.fromEntries(await request.formData());
  //   const { product } = formData;
  //   const newproduct = JSON.parse(formData.product)
  // console.log('Codigo:', request);


  //   const features = JSON.parse(newproduct.features);
  //   const variableArray = [];


  const getImages = (images, productId) => {
    jsonImg = JSON.parse(images);
    var arrayImages = [];

    for (let index = 0; index < jsonImg.length; index++) {
      arrayImages.push({
        "altText": "img" + productId + index,
        "src": `https://api.easyecomerce.com${jsonImg[index]}`
      })

    }
    return arrayImages

  }


  //   const { admin } = await authenticate.admin(request);
  //   const color = ["ROJO", "Naranja", "Amarillo", "verde"][
  //     Math.floor(Math.random() * 4)
  //   ];
  //   const response = await admin.graphql(
  //     `#graphql
  //      mutation populateProduct($input: ProductInput!) {
  //        productCreate(input: $input) {
  //          product {
  //            id
  //            title
  //            handle
  //            status
  //            variants(first: 10) {
  //              edges {
  //                node {
  //                  id
  //                  price
  //                  barcode
  //                  createdAt

  //                }
  //              }
  //            }
  //          }
  //        }
  //      }`,
  //     {
  //       variables: {
  //         input: {
  //           title: newproduct.product_name,
  //           descriptionHtml:features.description,
  //           publications: [
  //             {
  //               "channelHandle": "",
  //               "channelId": "gid://shopify/Channel/112212345051",
  //               "publicationId": "gid://shopify/Publication/112212345051",
  //               "publishDate": new Date().toISOString()
  //             }
  //           ],
  //           "productCategory": {
  //             "productTaxonomyNodeId": "gid://shopify/ProductTaxonomyNode/"+features.categories[0].id
  //           },
  //           variants: variableArray,
  //           images:  getImages(newproduct.url_img, newproduct.id)


  //         },
  //       },
  //     }
  //   );
  //   const responseJson = await response.json();


  //   const response2 = await admin.graphql(
  //     `#graphql
  //    query
  //     {
  //       locations(first: 10) {
  //         edges {
  //           node {
  //             id
  //             name
  //             address {
  //               city
  //               country
  //               address1
  //               address2
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `
  //   );

  //   const response4 = await admin.graphql(
  //     `#graphql
  //    query
  //     {
  //       publications(first: 10) {
  //         edges {
  //           node {
  //             id

  //           }
  //         }
  //       }
  //     }
  //   `
  //   );

    //const responseJson2 = await response2.json();
     //   const responseJson4 = await response4.json();


  //   console.log("locaciones=", responseJson2.data.locations.edges)
  //   console.log("salesChanels=", responseJson3.data.channels.edges)
  //   //console.log("publications=", responseJson4.data.ProductTaxonomyNode.edges)


  //   return json({
  //     product: responseJson.data.productCreate.product,
  //   });

  console.log("----proceso 1 exitoso----")

  const { code } = request;
  // let formData =request.formData();
  const formData = Object.fromEntries(await request.formData());
  const { product } = formData;
  const newproduct = JSON.parse(formData.product)
  console.log('Codigo:', request);
  console.log('producto', newproduct);



  const features = JSON.parse(newproduct.features);
  const variableArray = [];
  for (let index = 0; index < features.variants.length; index++) {
    variableArray.push({
      "sku": features.variants[index].sku + "C" + newproduct.product_id,
      "title": "Product" + index,
      "options": getCategories(features.variants[index]),
      "price": newproduct.price,
      //   "inventoryQuantities": [
      //     {
      //       "availableQuantity": 233,
      //       "locationId": `gid://shopify/Location/72892154075`
      //     }
      //  ],
    },)

  }


  console.log("----proceso 2 exitoso----")


  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];



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


const responseJson4 = await response4.json();


 const responseJson3 = await response3.json();
  console.log("publications=", responseJson4.data.publications.edges)

//  console.log("Node id:",responseJson3.data.channels.edges[0].node.id);
//  console.log("node name:",responseJson3.data.channels.edges[0].node.name);


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
          descriptionHtml: features.description,
          publications: [
            {
              "channelHandle": "",
              "channelId": responseJson3.data.channels.edges[0].node.id,
              "publicationId": responseJson4.data.publications.edges[0].node.id,
              "publishDate": new Date().toISOString()
            }
          ],
          productCategory: {
            "productTaxonomyNodeId": "gid://shopify/ProductTaxonomyNode/" + features.categories[0].id
          },
          variants: variableArray,
          images: getImages(newproduct.url_img, newproduct.id)

        },
      },
    }
  );

  const responseJson = await response.json();
  console.log("----proceso 3 exitoso----")

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export const loader = async ({ request }) => {
  var m = await authenticate.admin(request);

  const shop = m.session.shop;
  // const shop =  m.session.shop;
  var posts = await getToken(shop);
  return { posts };
};

const getToken = async (store_url) => {
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

  return (<Page>
        <ui-title-bar title="Importar productos" />
        <Layout>
          <Layout.Section>
            {posts !== 1 ? (
              <ImportProductsBlock
                 searchValue={searchValue}
                products={products}
                showGenerateButton={showGenerateButton}
                isLoading={isLoading}
                generateProduct={generateProduct}
                handleSearchChange={handleSearchChange}
                loadData={loadData}
                handleProductSelection={handleProductSelection}
                productId={productId}
                actionData={actionData}
                submit={submit}
                selectedProducts={selectedProducts}
              />
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>{"Debes agregar el token de autorización para poder importar productos"}</div>
            )}
          </Layout.Section>
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