// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice'; // venueReducer is just the variable name chosen for the default export. COULD be any name
import avReducer from './avSlice' // avReducer is also the default name chosen for this export. This could also have been any name
import mealsReducer from './mealsSlice';

/**
 * This code creates a global Redux store using the @reduxjs/toolkit\ configureStore() function 
 * so all components in the application can access the state managed by the venueReducer().
 * The same applies to the avReducer
 */
export default configureStore({
  reducer: {
    venue: venueReducer, // <-- attaches it to state.venue, the venue key could have been any name. This is just to make the code readable
    avg: avReducer,
    meals: mealsReducer,
  },
});
