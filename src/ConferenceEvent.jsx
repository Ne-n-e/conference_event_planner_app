import React, { useState } from "react";
import "./ConferenceEvent.css"; // CSS file for styling
import TotalCost from "./TotalCost"; // Component for showing total cost details
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { incrementQuantity, decrementQuantity } from "./venueSlice"; // Redux actions

// =======================
// Main Conference Event Component
// =======================
const ConferenceEvent = () => {
  // -----------------------
  // State hooks
  // -----------------------
  const [showItems, setShowItems] = useState(false); // Toggles between "details" view and "selection" view
  const [numberOfPeople, setNumberOfPeople] = useState(1); // Placeholder for people count (unused for now)

  // -----------------------
  // Redux state & dispatch
  // -----------------------
  const venueItems = useSelector((state) => state.venue); // Venue-related items from Redux store
  const avItems = useSelector((state) => state.av); // AV-related items from Redux store
  const dispatch = useDispatch();

  // Restrict auditorium booking to 3 max
  const remainingAuditoriumQuantity =
    3 - venueItems.find((item) => item.name === "Auditorium Hall (Capacity:200)").quantity;

  // -----------------------
  // Handlers
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
    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  //  AV and Meals 
  const handleIncrementAvQuantity = (index) => {
   
    }
  };
  const handleDecrementAvQuantity = (index) => {
   
  };

  const handleMealSelection = (index) => {};

  // -----------------------
  // Utility functions
  // -----------------------
  const getItemsFromTotalCost = () => {
    const items = [];
    return items;
  };

  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    }
    return totalCost;
  };

  // Venue total cost
  const venueTotalCost = calculateTotalCost("venue");

  // Navigation to sections (Venue, Add-ons, Meals)
  const navigateToProducts = (idType) => {
    if (idType === "#venue" || idType === "#addons" || idType === "#meals") {
      if (showItems) {
        setShowItems(!showItems);
      }
    }
  };

  // -----------------------
  // Component placeholders
  // -----------------------
  const items = getItemsFromTotalCost();

  const ItemsDisplay = ({ items }) => {
    // Placeholder: renders selected items in details view
    return <div>{/* TODO: Display items summary */}</div>;
  };

  // -----------------------
  // JSX
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
        {!showItems ? (
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
              <div className="addons_selection"></div>
              <div className="total_cost">Total Cost:</div>
            </div>

            {/* Meals Section */}
            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>
              <div className="input-container venue_selection"></div>
              <div className="meal_selection"></div>
              <div className="total_cost">Total Cost:</div>
            </div>
          </div>
        ) : (
          // -------------------
          // Details Mode
          // -------------------
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={venueTotalCost} // FIX: likely should be totalCosts object
              handleClick={handleToggleItems}
              ItemsDisplay={() => <ItemsDisplay items={items} />}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;
