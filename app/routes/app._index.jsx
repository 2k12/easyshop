import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import logoeasy from "../assets/logo.png";
import { FaCheckCircle } from 'react-icons/fa';

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  const shop = url.searchParams.get("shop");
  console.log("el valor de shop es;", shop)
  const accestoken = url.searchParams.get("accessToken");
  console.log("el valor de accestoken es:", accestoken)




  await authenticate.admin(request);

  return null;
};
let m = process.env.SHOPIFY_API_KEY;
let n = process.env.SHOPIFY_API_SECRET;
let o = process.env.SHOP_CUSTOM_DOMAIN;
export const action = async ({ request }) => {

  //console.log("requestffffrfrfrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
  //console.log(request)


  const { admin } = await authenticate.admin(request);
  //const { code } = await authenticate.admin(request);
  console.log("este es el codeggggggggggggggggggggggggggg");
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export default function Index() {
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

  const generateProduct = () => {
    console.log("Generate Product button clicked");
    submit({}, { replace: true, method: "POST" });
  };
  return (
    <Page>
      <img src={logoeasy} style={{ paddingBottom: '6px', marginBottom: '60px' }} alt="Post" />
      {/* <ui-title-bar title="Remix app template">
        <button variant="primary" onClick={generateProduct}>
          Crear un nuevo producto
        </button>
      </ui-title-bar> */}
      <BlockStack gap="600" >
        <BlockStack gap="200">

          <Layout>
            <Layout.Section>
              <Card >
                <BlockStack gap="200" style={{ paddingBottom: '20px' }}>
                  <Text as="h1" variant="headingMd">INSTRUCCIONES DE CONFIGURACIÓN</Text>
                </BlockStack>
                <BlockStack gap="200">
                  <List >
                    <List.Item>
                      <FaCheckCircle /> En tu cuenta EasyEcommerce, ubica la opción "Mis Integraciones"
                    </List.Item>
                    <List.Item>
                      <FaCheckCircle /> Accede al apartado de generación de Tokens y genera un nuevo Token
                    </List.Item>
                    <List.Item>
                      <FaCheckCircle /> En la plataforma Shopify, ve a la pestaña <Link url="https://megastoreecuador.myshopify.com/admin/apps/easyshop-4/app/config"
                        target="_blank"
                        removeUnderline>Configuraciones</Link>
                    </List.Item>
                    <List.Item>
                      <FaCheckCircle /> Ingresa el Nombre de tu tienda y el token previamente
                    </List.Item>
                  </List>
                </BlockStack>

              </Card>

            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap="500">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Conoce mas sobre Easyshop
                      {/* {m} */}
                      {/* {o} */}

                    </Text>
                    <Text as="p" variant="bodyMd" style={{ textAlign: 'justify' }}>

                      Easy Shop es una aplicación intuitiva de Shopify diseñada para simplificar la gestión de pedidos, proporcionando a los negocios una plataforma unificada para el seguimiento y control eficiente de cada venta. Su interfaz amigable permite una rápida adaptación y uso, asegurando que los comerciantes puedan monitorizar el estado de los pedidos en tiempo real. Con funcionalidades robustas para la organización de pedidos, Easy Shop aumenta la productividad al automatizar tareas repetitivas, reduce errores humanos y mejora la satisfacción del cliente al acelerar los tiempos de procesamiento. Esta herramienta es esencial para cualquier comerciante de Shopify que busque optimizar sus operaciones de venta en línea.
                    </Text>
                  </BlockStack>
                  {/* <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Get started with products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for
                    that product. Learn more about the{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                      target="_blank"
                      removeUnderline
                    >
                      productCreate
                    </Link>{" "}
                    mutation in our API references.
                  </Text>
                </BlockStack> */}
                  {/* <InlineStack gap="300">
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                  {actionData?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </Button>
                  )}
                </InlineStack> */}
                  {/* {actionData?.product && (
                  <Box
                    padding="400"
                    background="bg-surface-active"
                    borderWidth="025"
                    borderRadius="200"
                    borderColor="border"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify(actionData.product, null, 2)}</code>
                    </pre>
                  </Box>
                )} */}
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <BlockStack gap="500">
                <Card>
                  <Text as="h2" variant="headingMd">
                    Ventajas de Easyshop
                  </Text>
                  <BlockStack gap="200">
                    <List>
                      <List.Item>
                        Automatización

                      </List.Item>
                      <List.Item>
                        Personalización

                      </List.Item>
                      <List.Item>
                        Mejora de la Satisfacción del Cliente

                      </List.Item>
                      <List.Item>
                        Integración de Terceros
                      </List.Item>
                      <List.Item>
                        Eficiencia Operativa
                      </List.Item>
                      <List.Item>
                        Gestión Centralizada
                      </List.Item>
                      <List.Item>
                        Escalabilidad
                      </List.Item>




                    </List>
                  </BlockStack>
                </Card>
                {/* <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card> */}
              </BlockStack>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </BlockStack>
    </Page>
  );
}
