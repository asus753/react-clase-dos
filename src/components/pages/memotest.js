import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types';
import './memotest.css'
import ReactCardFlip from 'react-card-flip';

const arrayOrdenadoDeFrutas=["anana","anana",
	"banana","banana",
	"frutilla","frutilla",
	"manzana","manzana",
	"naranja","naranja",
	"pera","pera",
	"sandia","sandia",
	"uva","uva"
]

const CuadroMemotest = ({estado, clickFuncion, src} ) => {
    return(
        <div className='item'>
		   <ReactCardFlip isFlipped={estado} containerStyle={{width:'150px', heigth : '150px'}}>
			   <div key='front' className='front-carta' onClick={clickFuncion}></div>
			   <div key='back' className='back-carta'>
				   <img alt='fruta' src={src} className='img-memo'/>
			   </div>
		   </ReactCardFlip>
		</div>
	)
}

CuadroMemotest.propTypes = {
	estado : PropTypes.bool.isRequired,
	clickFuncion : PropTypes.func.isRequired,
	src : PropTypes.string.isRequired,
}

const ManejoJuego = ({funcionIniciar, funcionReiniciar, contador, juegoEstado}) => {
	return (
		<div id='manejo-del-juego'>
			<div>
				<button onClick={()=>{funcionIniciar()}} id='btn-iniciar'>
					Comenzar
				</button>
				<button style={{'marginLeft' : '10px'}} onClick={()=>{funcionReiniciar()}} id='btn-reiniciar'>
					Reiniciar
				</button>
				<strong style={{'marginLeft' : '10px', 'fontSize' : 'large'}}>{contador}</strong>
			</div>
			<div>
				<h2 style={juegoEstado === 'gano' ? {display:''} : {display:'none'}}>Felicitaciones, has ganado. Para jugar de nuevo presiona reiniciar!</h2>
				<h2 style={juegoEstado === 'perdio' ? {display:''} : {display:'none'}}>Has perdido, presiona reiniciar e intentalo nuevamente!</h2>
			</div>
		</div>
	)
}

ManejoJuego.propTypes = {
	funcionIniciar : PropTypes.func.isRequired,
	funcionReiniciar : PropTypes.func.isRequired,
	contador : PropTypes.number.isRequired,
	juegoEstado : PropTypes.string.isRequired,
}




const useTableroCartas = () => {
	const [frutas, setFrutas] = useState(crearObjetoFrutas(arrayOrdenadoDeFrutas))
	const [contador, setContador] = useState(60)
	const [juegoEstado, setJuegoEstado] = useState('inactivo')
	const [cartasClickeadas, setCartasClickeadas] = useState([])

	useInterval(()=>{
		setContador(contador-1)
	}, (juegoEstado === 'en juego' && contador>0))
	
	
	const iniciarJuego = () => {
		if(juegoEstado === 'inactivo'){
			setJuegoEstado('en juego')
		}
	}

	const reiniciarJuego = () =>{
		setJuegoEstado('inactivo')
		setFrutas(crearObjetoFrutas(arrayOrdenadoDeFrutas))
		setContador(60)
	}

	const clickCuadro = (index) => {
		const nuevoFrutas = [...frutas]
		nuevoFrutas[index].estado=true
		setFrutas(nuevoFrutas)
		
		const newCartasClickeadas = [...cartasClickeadas]
		newCartasClickeadas.push({
			src : nuevoFrutas[index].src,
			indice : index
		})
		setCartasClickeadas(newCartasClickeadas)
	}

	const evaluarJuegoFinalizado = ()=>{
		const todasVolteadas = frutas.every((carta) => carta.fueAdivinada === true)

		if(todasVolteadas && contador>0 && juegoEstado==='en juego'){
			setJuegoEstado('gano')
		}else if(!todasVolteadas && contador === 0 && juegoEstado === 'en juego'){
			setJuegoEstado('perdio')
		}
	}

	const evaluarCartasVolteadas = () => {

		if(cartasClickeadas.length === 2){
			if(cartasClickeadas[0].src === cartasClickeadas[1].src){
				const indice1 = cartasClickeadas[0].indice, indice2 = cartasClickeadas[1].indice
				setTimeout(()=>{
					quitarCartas(indice1, indice2)
				},700)
				setCartasClickeadas([])
			}else{
				const indice1 = cartasClickeadas[0].indice, indice2 = cartasClickeadas[1].indice
				setTimeout(()=>{
					ocultarCartas(indice1, indice2)
				},700)
				setCartasClickeadas([])
			}
		}
		
	}

	const quitarCartas = (indice1, indice2) => {
		const newFrutas = [...frutas]

		newFrutas[indice1].src = require('./imagenes-memotest/fondo.jpg')
		newFrutas[indice1].fueAdivinada = true
		newFrutas[indice2].src = require('./imagenes-memotest/fondo.jpg')
		newFrutas[indice2].fueAdivinada = true

		setFrutas(newFrutas)
	}

	const ocultarCartas = (indice1, indice2) => {
		const newFrutas = [...frutas]

		newFrutas[indice1].estado = false
		newFrutas[indice2].estado = false

		setFrutas(newFrutas)		
	}


	evaluarCartasVolteadas()
	evaluarJuegoFinalizado()
    return {frutas, clickCuadro, iniciarJuego, reiniciarJuego, contador, juegoEstado}
}




const TableroCartas = () => {
	const {frutas, clickCuadro, iniciarJuego, reiniciarJuego, contador, juegoEstado} = useTableroCartas()

	
    return(
		<>
		<div className='container'>
			{frutas.map((e,index) => (
				<CuadroMemotest estado={e.estado} 
								clickFuncion={(e.estado === false && juegoEstado === 'en juego') ? (()=>{clickCuadro(index)}) : (()=>{})}
								src={e.src}
								key={index}/>
			))}
		</div>
		<ManejoJuego funcionIniciar={iniciarJuego}
					 funcionReiniciar={reiniciarJuego}
					 contador={contador}
					 juegoEstado={juegoEstado}
		/>
		</>
    )
}

export default TableroCartas



function crearObjetoFrutas(array){
	let desordenado=array.sort(
		function(){
			return Math.random()-0.5
	})

	const frutas = desordenado.map(e=>{
		return {
			src : require(`./imagenes-memotest/${e}.jpg`),
			estado : false,
		}
	})

	return frutas
}

function useInterval(callback, gameState) {
	const savedCallback = useRef();
  
	useEffect(() => {
	  savedCallback.current = callback;
	});
  
	useEffect(() => {
	  	function tick() {
			savedCallback.current();
	}
  
	  	if(gameState){
			const id = setInterval(tick, 1000);
			return () => clearInterval(id);
		}
	}, [gameState]);
}