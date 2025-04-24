import style from "./home.module.css"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"

import { useState, FormEvent } from "react"

export function Home(){

  const [input, setInput] = useState("")
  const navigate = useNavigate()

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

              <tr className={style.tr}>

                <td className={style.tdLabel} data-label="Moeda">
                  <div className={style.name}>
                     <Link to={"/detail/bitcoin"}>
                       <span>Bitcoin</span> | BTC
                     </Link>
                  </div>
                </td>

                <td className={style.tdLabel} data-label="Valor mercado">
                  1T
                </td>

                <td className={style.tdLabel} data-label="Preço">
                  8.000
                </td>

                <td className={style.tdLabel} data-label="Volume">
                  2B
                </td>

                <td className={style.tdProfit} data-label="Mudança 24h">
                  <span>1.20</span>
                </td>
                
              </tr>

            </tbody>
          </table>
          <button className={style.buttonMore} onClick={handleGetMore}>Carregar mais</button>
      </main>
    )
  }