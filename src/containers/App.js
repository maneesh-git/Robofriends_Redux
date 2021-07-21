import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSearchField, requestRobots } from '../actions';

import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundry from '../components/ErrorBoundry';

import './App.css';

// parameter state comes from index.js provider store state(rootReducers)
const mapStateToProps = (state) => {
  return {
    searchField: state.searchRobots.searchField,
    robots: state.requestRobots.robots,
    isPending: state.requestRobots.isPending
  }
}

// Dispatch the DOM changes to call an action. 
// Note :  mapStateToProps returns an object, mapDispatchToProps returns a function
// the function returns an object then uses connect to change the data from redecers.
const mapDispatchToProps = (dispatch) => {
  return {
    onSearchChange: (event) => dispatch( (event.target.value)),
    onRequestRobots: () => dispatch(requestRobots())
  }
} 

class App extends Component {
  componentDidMount() {
    this.props.onRequestRobots();
  }

  render() {
    const { robots, searchField, onSearchChange, isPending } = this.props;
    const filteredRobots = robots.filter(robot => {
      return robot.name.toLowerCase().includes(searchField.toLowerCase());
    })
    return (
      <div className='tc'>
        <h1 className='f1'>RoboFriends</h1>
        <SearchBox searchChange={onSearchChange}/>
        <Scroll>
          { isPending ? <h1>Loading</h1> :
            <ErrorBoundry>
              <CardList robots={filteredRobots} />
            </ErrorBoundry>
          }
        </Scroll>
      </div>
    );
  }
}

// action done from mapDispatchToProps will channge state from mapStateToProps
export default connect(mapStateToProps, mapDispatchToProps)(App);

/*

Connect is a HOC that is its a function that returns another function.

Connect when it runs does something and returns another function.
so basically it returns (App).
connect()(App).

Connect accepts two parameters, we can name them whatever we want 
but as per standard they are called
mapStateToProps and mapDispatchToProps

So we have connected the App component, and just said subscribe to any changes in the redux store.
So now App is subscribed to the Redux store,
but we need to tell it what state to listen to and what dispatch to listen to, 
which is done in mapStateToProps and mapDispatchToProps respectively.

so mapStateToProps recieves a State and returns an object.

      const mapStateToProps = (state) => {
        return {
          searchField: state.searchRobots.searchField,
          robots: state.requestRobots.robots,
          isPending: state.requestRobots.isPending
        }
      }

      searchField : state.searchField   ---  We have to write like this, if there is only one reducer and not many.

The function says that the searchField that we are going to return which is going to be used as props by App,
is going to come from the state.searchRobots.searchField.
which comes from our reducer,
because remember in index.js file, we create the store using the seachRobots reducer.

const store =  createStore(searchRobots).


mapDispatchToProps recieves something called dispatch,

dispatch is what triggers an action that will be sent to the reducer.
So dispatch can be used to send actions to our reducer.
 
      const mapDispatchToProps = (dispatch) => {
        return {
          onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
          onRequestRobots: () => dispatch(requestRobots())
        }
      } 

Dispatch can be used to send actions and the way we do that is 
we can say 

onSearchChange: (event) => dispatch(setSearchField(event.target.value))

onSearchChange is just a name and we can name it anything.
It is a prop that App component will receive.


So mapStateToProps is telling what state ot listen and send it as props.
and mapDispatchToProps says tells what props to listen to that are actions that need to get dispatched.

So connect will run the first part of the function and say 
I'm listening to this part of the state,
and I'm interested in this part of the action.
and then it will give those things as props to the App component.


Redux thunk middleware and mapDispatchToProps working : 


Redux thunk is a middleware that waits and sees if any action is returning a function instead of an object,
thunk will act upon it.

onRequestRobots: () => requestRobots(dispatch)
is same as
onRequestRobots: () => dispatch(requestRobots())


In the second part, ie, onRequestRobots, we dont want to just dispatch an action,
we want to return a function from it, in our case here it is the 
requestRobots() reducer that has to get dispatch as props to dispatch three different actions.

So previously the requestRobots action was just like this :


        export const requestRobots = (dispatch) => {
            dispatch({ type: REQUEST_ROBOTS_PENDING })
            apiCall('https://jsonplaceholder.typicode.com/users')
              .then(data => dispatch({ type: REQUEST_ROBOTS_SUCCESS, payload: data }))
              .catch(error => dispatch({ type: REQUEST_ROBOTS_FAILED, payload: error }))
        }

so in mapDispatchToProps, we change the line  

        onRequestRobots: () => requestRobots(dispatch)

to the following line 

        onRequestRobots: () => dispatch(requestRobots())

So now this is dispatch is going to work as long as we use Redux Thunk,
because its going to catch the fact that the above line is going to return a function.

So if we go back to our actions, we can do this

From      export const requestRobots = (dispatch) => {}

To        export const requestRobots = () => (dispatch) => {}

So essentially we have created a higher order function here 
thats a function that returns another function.

So thunk will provide dispatch to the second layer function so that it can dispatch various actions.


Plain normal redux out of the box would not understand this 
        export const requestRobots = () => (dispatch) => {}
simply because we are not returning an object as it expects from an action,
but we are returning a function here,
and this function isn't going to mean anything to redux.

Only by adding redux thunk middleware, we are now listening to actions.
And anytime the requestRobots action gets triggered, 
its going to return a function and trigger redux thunk in the process 

and redux thunk is going to say oh this is a function, and I will give you the dispatch,
so you can go ahead and call some actions,
so finally requestRobots can run and dispatch some actions on its own.
 

*/
