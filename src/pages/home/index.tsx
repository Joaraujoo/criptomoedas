import style from "./home.module.css"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"

import { useState, FormEvent, useEffect } from "react"
import axios from "axios"

export interface CoinProps{
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp{
  data: CoinProps[];
}

export function Home(){

  const [input, setInput] = useState("")
  const [coins, setcoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [offset])

  //REQUISIÇAO DA API
  async function getData(){
    try{
      const response = await axios<DataProp>(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=a3ee552b1ffab98352f813e9d2525021ec4df9266072a552600a585320a550a5`)
    
      const coinsData = response.data.data

      //Formata a moeda (Intl é uma biblioteca internacional)
      const price = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      })

      const priceCompact = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact"
      })

      //Adiciona as moedas formatadas no array da API
      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        }
        return formated
      })

      const listCoins = [...coins, ...formatedResult]
      setcoins(listCoins)

    } catch(erro){
        console.log("Erro ao buscar dados de moedas:", erro)
    }
  }

  //FUNÇAO PARA PESQUISAR A MOEDA
  function handleSubmit(e: FormEvent){
    e.preventDefault()

    //Verifica se o input esta vazio
    if(!input) return;
    
    //Navega para a pagina da moeda
    navigate(`/detail/${input}`)
  }

  //FUNCAO PARA CARREGAR MAIS MOEDAS
  function handleGetMore(){
    if(offset === 0) {
      setOffset(10)
      return
    }

    setOffset(offset + 10)
  }

    return(
      <main className={style.container}>
          <form className={style.form} onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="Digite o nome da moeda... Ex bitcoin"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button type="submit">
              <BsSearch size={30} color="#FFF"/>
            </button>

          </form>

          <table>
            <thead>
              <tr>
                <th scope="col">Moeda</th>
                <th scope="col">Valor mercado</th>
                <th scope="col">Preço</th>
                <th scope="col">Volume</th>
                <th scope="col">Mudança 24h</th>
              </tr>
            </thead>

            <tbody id="tbody">

              {coins.length > 0 && coins.map((item) => (
                <tr className={style.tr} key={item.id}>

                <td className={style.tdLabel} data-label="Moeda">
                  
                  <div className={style.name}>
                  <img className={style.logo} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="Logo" />
                     <Link to={`/detail/${item.id}`}>
                       <span>{item.name}</span> | {item.symbol}
                     </Link>
                  </div>
                </td>

                <td className={style.tdLabel} data-label="Valor mercado">
                  {item.formatedMarket}
                </td>

                <td className={style.tdLabel} data-label="Preço">
                  {item.formatedPrice}
                </td>

                <td className={style.tdLabel} data-label="Volume">
                  {item.formatedVolume}
                </td>

                <td className={Number(item.changePercent24Hr) > 0 ? style.tdProfit : style.tdLoss} data-label="Mudança 24h">
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
                
              </tr>
              ))}

            </tbody>
          </table>
          <button className={style.buttonMore} onClick={handleGetMore}>Carregar mais</button>
      </main>
    )
  }