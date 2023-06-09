import Head from "next/head";
import { Inter } from "next/font/google";
import { useState } from "react";
import Product from "@/components/Product";
import { initMongoose } from "@/lib/mongoose";
import { findAllProducts } from "./api/products";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home({products}) {
  const [phrase, setPhrase] = useState("");

  const categoriesNames = [...new Set(products.map((p) => p.category))];

  if (phrase) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(phrase)
    );
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <input
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          type="text"
          placeholder="Search for products..."
          className="bg-gray-100 w-full py-2 px-4 rounded-xl"
        />
        <div>
          {categoriesNames.map((categoryName) => (
            <div key={categoryName}>
              {products.find((p) => p.category === categoryName) && (
                <div>
                  <h2 className="text-2xl py-5">{categoryName}</h2>
                  <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                    {products
                      .filter((p) => p.category === categoryName)
                      .map((productInfo) => (
                        <div key={productInfo._id} className="px-5 snap-start">
                          <Product {...productInfo} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>                   

      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  await initMongoose()
  const products = await findAllProducts()
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  }
}
