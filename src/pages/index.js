// pages/index.js
import dynamic from 'next/dynamic'
import Head from 'next/head'

const FurnitureConfigurator = dynamic(() => import('../components/FurnitureConfigurator'), {
  ssr: false
})

export default function Home() {
  return (
    <>
      <Head>
        <title>3D Furniture Configurator</title>
        <meta name="description" content="Interactive 3D furniture configurator with material swapping and lighting controls" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FurnitureConfigurator />
    </>
  )
}