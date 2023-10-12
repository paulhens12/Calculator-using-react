import { useReducer } from 'react';
import './styles.css';
import DigitFunction from './DigitButton';
import OperationFunction from './OperationButton';

const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : 'clear',
  DELETE_DIGIT : 'delete-digit',
  EVALUATE : 'evaluate'
}

function reducer(state, { type, payload }){
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0') return state;
      if(payload.digit === '.' && state.currentOperand == null){
        return{
          ...state,
          currentOperand: '0.'
        }
      }
      if(payload.digit === '.' && state.currentOperand.includes('.')){
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand==null && state.previousOperand === null) return state;
      if(state.previousOperand == null){
      return{
        ...state,
        operation: payload.operation,
        currentOperand : null,
        previousOperand : state.currentOperand
      }}
      if(state.currentOperand == null){
        return {
          ...state,
          operation : payload.operation
        }
      }

      return{
        ...state,
        operation: payload.operation,
        currentOperand : null,
        previousOperand : evaluate(state)
      }


    case ACTIONS.CLEAR:
      return{}

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) return state;
      return{
        ...state,
        currentOperand: evaluate(state),
        overwrite:true,
        operation:null,
        previousOperand: null,
        
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:null,
          overwrite:false
        }
      }
      if(state.currentOperand == null ) return state
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}


function evaluate({currentOperand, previousOperand, operation}){
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if(isNaN(previous) || isNaN(current)) return '';

  let answer = '';
  switch (operation){
    case '+':
      answer = previous + current;
      break;
    case '-':
      answer = previous - current;
      break;
    case '*':
      answer = previous * current;
      break;
    case '/':
      answer = previous / current;
      break;
  }
  return answer;
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits : 0,
})

function formatOpearand(operand){
  if(operand == null) return;
  let newOperand = String(operand);
  const [integer, decimal] = newOperand.split(".");
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`}


function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer, 
    {}
    )
  
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOpearand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOpearand(currentOperand)}</div>
      </div>

      <button className = "span-two" onClick={()=> dispatch({type : ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type : ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationFunction operation='/' dispatch={dispatch}/>
      <DigitFunction digit='1' dispatch={dispatch}/>
      <DigitFunction digit='2' dispatch={dispatch}/>
      <DigitFunction digit='3' dispatch={dispatch}/>
      <OperationFunction operation='*' dispatch={dispatch}/>
      <DigitFunction digit='4' dispatch={dispatch}/>
      <DigitFunction digit='5' dispatch={dispatch}/>
      <DigitFunction digit='6' dispatch={dispatch}/>
      <OperationFunction operation='+' dispatch={dispatch}/>
      <DigitFunction digit='7' dispatch={dispatch}/>
      <DigitFunction digit='8' dispatch={dispatch}/>
      <DigitFunction digit='9' dispatch={dispatch}/>
      <OperationFunction operation='-' dispatch={dispatch}/>
      <DigitFunction digit='.' dispatch={dispatch}/>
      <DigitFunction digit='0' dispatch={dispatch}/>
      <button className="span-two" onClick={()=> dispatch({type : ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
export {ACTIONS} ;
