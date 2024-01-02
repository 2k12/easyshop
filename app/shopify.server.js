import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import prisma from "./db.server";

const shopify = shopifyApp({
  
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      const shopDomain = session.shop;
      console.log('Dominio de la app:', shopDomain);
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

// export async function createToken(token,nombreTienda){
//   try {
//     // Ejemplo: Crear un token de prueba
//     const nuevoToken = await prisma.token.create({
//       data: {
//         token: 'valor_del_token_de_prueba',
//         nombreTienda: 'nombre_de_la_tienda_de_prueba'
//       }
//     });
//     console.log('Token de prueba creado:', nuevoToken);
//   } catch (error) {
//     console.error('Error al crear datos de prueba:', error);
//   }
// }

// export const consultarTokens = async () => {
//   try {
//     const tokens = await prisma.token.findMany();
//     console.log('Tokens consultados:');
   
//       console.log(token); // Muestra cada token en el console.log
    
//     return tokens;
//   } catch (error) {
//     console.error('Error al consultar los tokens:', error);
//     throw error;
//   }
// };

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
