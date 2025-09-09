import React, { useState } from "react";
import "./ConferenceEvent.css"; // CSS file for styling
import TotalCost from "./TotalCost"; // Component for showing total cost details
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { incrementQuantity, decrementQuantity } from "./venueSlice"; // Redux actions
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

// =======================
// Main Conference Event Component
// =======================
const ConferenceEvent = () => {
  // -----------------------
  // State hooks
  // -----------------------
  const [showItems, setShowItems] = useState(false); // Toggles between "details" view and "selection" view
  const [numberOfPeople, setNumberOfPeople] = useState(1); // Placeholder for people count 

  // -----------------------
  // Redux state & dispatch
  // -----------------------
  const venueItems = useSelector((state) => state.venue); // The useSelector() function retrieves venue items from the Redux store state
  const avItems = useSelector((state) => state.avg); // AV-related items from Redux store
  const mealsItems = useSelector((state) => state.meals);
  const dispatch = useDispatch();

  // Restrict auditorium booking to 3 max
  const remainingAuditoriumQuantity =
    3 - venueItems.find((item) => item.name === "Auditorium Hall (Capacity:200)").quantity;

  // -----------------------
  // EVENT Handlers
  // -----------------------
  const handleToggleItems = () => {
    console.log("handleToggleItems called");
    setShowItems(!showItems); // Switch between detail and selection mode
  };

  const handleAddToCart = (index) => {
    // Prevent Auditorium booking if limit reached
    if (
      venueItems[index].name === "Auditorium Hall (Capacity:200)" &&
      venueItems[index].quantity >= 3
    ) {
      return;
    }
    /*
    The dispatch call fires off an action to Redux, telling it “Hey, increase the quantity of the venue at this index.”
    Redux then updates the state accordingly, and React re-renders with the new state.*/
    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index)); 
    }
  };

  //  AV and Meals 
  const handleIncrementAvQuantity = (index) => {
    if(avItems){
        dispatch(incrementAvQuantity(index));
    }
   
    }
  
  const handleDecrementAvQuantity = (index) => {
    if(avItems[index].quantity > 0){
        dispatch(decrementAvQuantity(index));
    }
  };

  const handleMealSelection = (index) => {
    const item = mealsItems[index];
    if (item.selected && item.type === "mealForPeople") {
        // Ensure numberOfPeople is set before toggling selection
        const newNumberOfPeople = item.selected ? numberOfPeople : 0;
        dispatch(toggleMealSelection(index, newNumberOfPeople));
    }
    else {
        dispatch(toggleMealSelection(index));
    }
  };

  // -----------------------
  // Utility functions
  // -----------------------
  const getItemsFromTotalCost = () => {
    const items = [];
    venueItems.forEach((item) => {
      if (item.quantity > 0) {
        items.push({ ...item, type: "venue" });
      }
    });
    avItems.forEach((item) => {
      if (
        item.quantity > 0 &&
        !items.some((i) => i.name === item.name && i.type === "av")
      ) {
        items.push({ ...item, type: "av" });
      }
    });
    mealsItems.forEach((item) => {
      if (item.selected) {
        const itemForDisplay = { ...item, type: "meals" };
        if (item.numberOfPeople) {
          itemForDisplay.numberOfPeople = numberOfPeople;
        }
        items.push(itemForDisplay);
      }
    });
    return items;
  };

  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    }else if(section === "avg"){
        avItems.forEach((item => {
            totalCost += item.cost * item.quantity;
        }));
    }else if(section === "meals"){
        mealsItems.forEach((item) => {
            if (item.selected) {
              totalCost += item.cost * numberOfPeople;
            }
          });
    }
    return totalCost;
  };

  // Venue total cost
  const venueTotalCost = calculateTotalCost("venue");

  // Average total cost
  const avTotalCost = calculateTotalCost("avg");

  // Meals total cost
  const mealsTotalCost = calculateTotalCost("meals");

  // Overall Total cost
  const totalCosts = {
    venue: venueTotalCost,
    avg: avTotalCost,
    meals: mealsTotalCost,
};

  // Navigation to sections (Venue, Add-ons, Meals)
  const navigateToProducts = (idType) => {
    if (idType === "#venue" || idType === "#addons" || idType === "#meals") {
      if (showItems) {
        setShowItems(!showItems);
      }
    }
  };

  // -----------------------
  // Get Total Cost
  // -----------------------
  const items = getItemsFromTotalCost();

  // Component to display Items. TODO; Create a separate component for this items
  const ItemsDisplay = ({ items }) => {    
    console.log(items);
    return 
    <>
        <div className="display_box1">
            {items.length === 0 && <p>No items selected</p>}
            <table className="table_item_data">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit Cost</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>${item.cost}</td>
                            <td>
                                {item.type === "meals" || item.numberOfPeople
                                ? ` For ${numberOfPeople} people`
                                : item.quantity}
                            </td>
                            <td>{item.type === "meals" || item.numberOfPeople
                                ? `${item.cost * numberOfPeople}`
                                : `${item.cost * item.quantity}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>;
  };

  // -----------------------
  // JSX Layouts
  // -----------------------
  return (
    <>
      {/* Navbar Section */}
      <navbar className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>
        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")}>
              Venue
            </a>
            <a href="#addons" onClick={() => navigateToProducts("#addons")}>
              Add-ons
            </a>
            <a href="#meals" onClick={() => navigateToProducts("#meals")}>
              Meals
            </a>
          </div>
          <button
            className="details_button"
            onClick={() => setShowItems(!showItems)}
          >
            Show Details
          </button>
        </div>
      </navbar>

      {/* Main Container */}
      <div className="main_container">
        {!showItems ? (  //  variable to toggle functionality
          // -------------------
          // Selection Mode
          // -------------------
          <div className="items-information">
            {/* Venue Section */}
            <div id="venue" className="venue_container container_main">
              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>

              <div className="venue_selection">
                {venueItems.map((item, index) => (
                  <div className="venue_main" key={index}>
                    {/* Venue Image */}
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>

                    {/* Venue Info */}
                    <div className="text">{item.name}</div>
                    <div>${item.cost}</div>

                    {/* Buttons */}
                    <div className="button_container">
                      {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (
                        // Auditorium Special Case
                        <>
                          <button
                            className={
                              venueItems[index].quantity === 0
                                ? "btn-warning btn-disabled"
                                : "btn-minus btn-warning"
                            }
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>
                          <span className="selected_count">
                            {venueItems[index].quantity > 0
                              ? ` ${venueItems[index].quantity}`
                              : "0"}
                          </span>
                          <button
                            className={
                              remainingAuditoriumQuantity === 0
                                ? "btn-success btn-disabled"
                                : "btn-success btn-plus"
                            }
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      ) : (
                        // Default Case
                        <div className="button_container">
                          <button
                            className={
                              venueItems[index].quantity === 0
                                ? " btn-warning btn-disabled"
                                : "btn-warning btn-plus"
                            }
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>
                          <span className="selected_count">
                            {venueItems[index].quantity > 0
                              ? ` ${venueItems[index].quantity}`
                              : "0"}
                          </span>
                          <button
                            className={
                              venueItems[index].quantity === 10
                                ? " btn-success btn-disabled"
                                : "btn-success btn-plus"
                            }
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Venue Total Cost */}
              <div className="total_cost">Total Cost: ${venueTotalCost}</div>
            </div>

            {/* Add-ons Section */}
            <div id="addons" className="venue_container container_main">
              <div className="text">
                <h1>Add-ons Selection</h1>
              </div>
              <div className="addons_selection">
                {avItems.map((item, index) => (
                    <div className="av_data venue_main" key={index}>
                        <div className="img">
                            <img src={item.img} alt={item.name} />
                        </div>
                        <div className="text"> {item.name} </div>
                        <div> ${item.cost} </div>
                        <div className="addons_btn">
                            <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                        </div>
                    </div>
                ))}
              </div>
              <div className="total_cost">Total Cost:{avTotalCost}</div>
            </div>

            {/* Meals Section */}
            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>
              <div className="input-container venue_selection">
                    <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                    <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                    min="1" />
              </div>
              <div className="meal_selection">
                    {
                        mealsItems.map((item, index) => (
                            <div className="meal_item" key={index} style={{ padding: 15 }}>
                                <div className="inner">
                                    <input type="checkbox" id={ `meal_${index}` } checked={item.selected} 
                                      onChange={() => handleMealSelection(index)} />
                                    <label htmlFor={`meal_${index}`}> {item.name}</label>
                                </div>
                                <div className="meal_cost">${item.cost}</div>
                            </div>
                        ))
                    }
              </div>

              <div className="total_cost">Total Cost: {mealsTotalCost}</div>
            </div>
          </div>
        ) : (
          // -------------------
          // Details Mode
          // -------------------
          <div className="total_amount_detail">            
              <TotalCost totalCosts={ totalCosts } ItemsDisplay={() => <ItemsDisplay items={ items } />} />             
          </div>
        )}
      </div>
    </>
  );
};



export default ConferenceEvent;
