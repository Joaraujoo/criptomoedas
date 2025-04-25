import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CoinProps } from "../home"
import style from "./detail.module.css"

interface ResponseData{
  data: CoinProps
}

interface ErrorData{
  error: string
}

type DataProps = ResponseData | ErrorData

export function Detail(){

  const { cripto } = useParams()
  const navigate = useNavigate()

  const [coin, setCoin] = useState<CoinProps>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {

   //REQUISIÇAO DA API
   async function getCoin(){
    try{  
     const response = await axios(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=a3ee552b1ffab98352f813e9d2525021ec4df9266072a552600a585320a550a5`)
     const coins: DataProps = response.data

     if("error" in coins){
      navigate("/")
      return
     }
      //Formata a moeda (Intl é uma biblioteca internacional)
    const price = Intl.NumberFormat("en-US",{
      style: "currency",
      currency: "USD"
    })

    const priceCompact = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact"
    })

    //Adiciona as moedas formatadas no array da API
    const resultData = {
      ...coins.data,
      formatedPrice: price.format(Number(coins.data.priceUsd)),
      formatedMarket: priceCompact.format(Number(coins.data.marketCapUsd)),
      formatedVolume: priceCompact.format(Number(coins.data.volumeUsd24Hr))
    }

    setCoin(resultData)
    setLoading(false)

    } catch(erro){
      console.log(erro)
      navigate("/")
    }
   }

   getCoin()
  }, [cripto, navigate])

  if(loading || !coin){
    return(
      <div className={style.container}>
        <h4 className={style.center}>Carregando detalhes...</h4>
      </div>
    )
  }

    return(
      <div className={style.container}>
        <h1 className={style.center}>{coin?.name}</h1>
        <h1 className={style.center}>{coin?.symbol}</h1>

        <section className={style.content}>
        <img className={style.logo} src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="Logo" />
        <h1>{coin?.name} | {coin?.symbol}</h1>

        <p><strong>Preço: </strong>{coin?.formatedPrice}</p>

        <a><strong>Mercado: </strong>{coin?.formatedMarket}</a>

        <a><strong>Volume: </strong>{coin?.formatedVolume}</a>

        <a><strong>Mudança 24h: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? style.profit : style.loss}>{Number(coin?.changePercent24Hr).toFixed(3)}</span></a>
        </section>
      </div>
    )
  }