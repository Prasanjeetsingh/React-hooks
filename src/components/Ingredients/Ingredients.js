import React , { useReducer , useState , useEffect , useCallback , useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';


const ingredientReducer = (currentIngredients , action) => {
  switch(action.type) {
    case 'SET':
     return action.ingredients;
    case 'ADD':
     return [...currentIngredients , action.ingredient];
    case 'DELETE':
     return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should nor get there!');
  }
};

// const httpReducer = (curHttpState, action) => {
//   switch(action.type){
//     case 'SEND':
//       return { loading: true , error: null};
//     case 'RESPONSE':
//       return {...curHttpState, loading:false};
//     case 'ERROR':
//      return{loading: false , error: action.errorMessage};
//     case 'CLEAR':
//      return { ...curHttpState, error: null };
//     default:
//      throw new Error('Should not be reached!');
//   }
// };

const Ingredients = (props) => {

  const {isLoading ,error , data , sendRequest , reqExtra , reqIdentifier,clear} = useHttp();

  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //const [httpState , dispatchHttp] = useReducer(httpReducer , {loading: false , error: null});


  //const [userIngredients, setuserIngredients] = useState([]);
  //const [isLoading , setIsLoading]=useState(false);
  //const [error , setError] = useState();

// ComponentDidMount

// useEffect(() => {
//   fetch('https://react-hook-update-f2705-default-rtdb.firebaseio.com/ingredients.json')
//   .then(response => response.json())
//   .then(responseData => {
//     const loadedIngredients = [];
//     for(const key in responseData){
//       loadedIngredients.push({
//         id: key,
//         title: responseData[key].title,
//         amount: responseData[key].amount
//       });
//     }
//     setuserIngredients(loadedIngredients);
//   });
// }, []);

useEffect(() => {

   if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
     dispatch({type: 'DELETE' , id: reqExtra})
   }
   else if ( !isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
     dispatch({type: 'ADD' , ingredient: {id: data.name, ...reqExtra} });
   }

}, [data , reqExtra , reqIdentifier , error , isLoading]);

const filteredIngredientsHandler = useCallback(filteredIngredients => {
  //setuserIngredients(filteredIngredients);
  dispatch({type: 'SET' , ingredients: filteredIngredients});
},[]);

  const addIngredientHandler = useCallback(ingredient => {


    sendRequest('https://react-hook-update-f2705-default-rtdb.firebaseio.com/ingredients.json', 'POST',
    JSON.stringify(ingredient),
    ingredient,
    'ADD_INGREDIENT'
  );



    // fetch('https://react-hook-update-f2705-default-rtdb.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {'Content-Type': 'application/json'}
    // })
    // .then(response => {
    //   //dispatchHttp({type: 'RESPONSE'});
    //   return response.json();
    // })
    // .then(responseData => {
    //   // setuserIngredients(prevIngredients => [
    //   //   ...prevIngredients,
    //   //   {id: Math.random().toString(), ...ingredient}
    //   // ]);
    //
    //   //dispatch({type: 'ADD' , ingredient: {id: Math.random().toString(), ...ingredient} });
    // });

  },[sendRequest]);

const removeIngredientHandler = useCallback(ingredientId => {


sendRequest(`https://react-hook-update-f2705-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
  'DELETE',
  null,
  ingredientId,
  'REMOVE_INGREDIENT'
);
},[sendRequest]);

// const clearError = useCallback(() => {
// //dispatchHttp({type: 'CLEAR'});
// },[]);

const ingredientList  = useMemo(() => {
  return (
            <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
  );
}, [userIngredients , removeIngredientHandler]);

  return (
    <div className="App">
    {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
