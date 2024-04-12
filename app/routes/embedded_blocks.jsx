import { BlockStack, Button, Card, Checkbox, DataTable, Layout, Link, List, Page, Text, TextField } from "@shopify/polaris";
import { FaCheckCircle } from "react-icons/fa";

// Bloque de Inserción para Instrucciones de Configuración
export const SetupInstructionsBlock = () => (
    <Card>
        <BlockStack>
            <Text as="h1" variant="headingMd">
                INSTRUCCIONES DE CONFIGURACIÓN
            </Text>
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
);

// Bloque de Inserción para Información sobre Easyshop
export const AboutEasyshopBlock = () => (
    <Card>
        <BlockStack>
            <Text as="h2" variant="headingMd">
                Conoce más sobre Easyshop
            </Text>
            <Text as="p" variant="bodyMd" style={{ textAlign: 'justify' }}>
                Easy Shop es una aplicación intuitiva de Shopify diseñada para simplificar la gestión de pedidos, proporcionando a los negocios una plataforma unificada para el seguimiento y control eficiente de cada venta. Su interfaz amigable permite una rápida adaptación y uso, asegurando que los comerciantes puedan monitorizar el estado de los pedidos en tiempo real. Con funcionalidades robustas para la organización de pedidos, Easy Shop aumenta la productividad al automatizar tareas repetitivas, reduce errores humanos y mejora la satisfacción del cliente al acelerar los tiempos de procesamiento. Esta herramienta es esencial para cualquier comerciante de Shopify que busque optimizar sus operaciones de venta en línea.
            </Text>
        </BlockStack>
    </Card>
);

// Bloque de Inserción para Ventajas de Easyshop
export const AdvantagesBlock = () => (
    <Card>
        <BlockStack>
            <Text as="h2" variant="headingMd">
                Ventajas de Easyshop
            </Text>
            <BlockStack>
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
        </BlockStack>
    </Card>
);


// Bloque de Inserción para Importar Productos
export const ImportProductsBlock = ({searchValue, products, showGenerateButton, isLoading, generateProduct, handleSearchChange, loadData, handleProductSelection, productId, actionData, submit,selectedProducts }) => (
    <Card>
      <BlockStack gap="700">
        <TextField
          label="Ingrese código(s) para buscar producto"
          placeholder="Ingrese el código..."
          value={searchValue}
          onChange={handleSearchChange}
        />
        <div style={{ display: 'flex', justifyContent: 'left', marginTop: '15px', marginBottom: '15px' }}>
          <Button primary onClick={() => loadData()}>
            Buscar
          </Button>
          <div style={{ width: '10px' }}></div>
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
  );


  // Bloque de Inserción para Configuraciones
export const ConfigurationsBlock = ({ posts, shop, inputToken, handleSearchChange, saveToken }) => (
    <Page>
      <ui-title-bar title="Configuraciones" />
      <Layout>
        <Layout.Section>
          {posts !== 1 ? (
            <Card>
              <BlockStack gap="700">
                <DataTable
                  columnContentTypes={['text', 'text']}
                  headings={['Store', 'Token']}
                  rows={[
                    [
                      <div style={{ whiteSpace: 'pre-wrap' }}>{posts.integration.store_url ?? ""}</div>,
                      <div style={{ whiteSpace: 'pre-wrap' }}>{posts.integration.token ?? ""}</div>,
                    ],
                  ]}
                  style={{
                    tableLayout: 'fixed',
                    width: '100%',
                  }}
                />
              </BlockStack>
            </Card>
          ) : (
            <Card>
              <TextField
                label="Ingresar token easyecommerce"
                placeholder="Ingresar token aquí"
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
  
  