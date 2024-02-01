import { useState } from "react";

const initialFriends = [
  {
    id: 118837,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118837",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: " Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  // <button></button> is used just like always when creating a btn
  // the classname is to apply the specific setting in the css

  // children is to accept any text added to the individual btns
  // like "Add" or "Select"

  // when writing <Button></Button> with cap B we get everything inside of
  // this function
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  // we lifted up state , so we moved friends and setFriends
  // to the top level in order for multiple parts of the code to
  // be able to access the data
  const [friends, setFriends] = useState(initialFriends);

  // show add friend should be hidden per default, and state is therefore false
  const [showAddFriend, setShowAddFriend] = useState(false);

  // default state is null = No friend is seleted
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Toggle the visibility of the "Add friend" form by toggling the 'showAddFriend' state.
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    // We create a new array because one should not mutate in react
    // so we use spread on ...friends
    // and add the new friend to the end of the new array/object
    setFriends((friends) => [...friends, friend]);
    // after we have added a friend, the add friend should automatically close
    setShowAddFriend(false);
  }

  // Handle friend selection: If the clicked friend is already selected, deselect it; otherwise, select it.
  // Close the "Add friend" form after a friend is selected.
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));

    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  //the div classnames
  // provides the css styling for the classes "app" and "sidebar"
  // friendlist is called within var app and the classes so will also
  // get that styling
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        {/* If we are currently showing the add friend 
        part of the website, then the btn should display "close"
        else display "Add friend"
        */}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {/* FormSplitBill Is not a part of the sidebar (things on the left 
        so needs to be outside of the sidebar div
        
        When selectedfriend is null,  the end operator will short 
        circet and will not display FormSplitBill 
        If a friend is selected, then FormSplitBill will be displayed  */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          // added a key to make the values in split bill unique
          // IN "Components” it looks likethis "FormSplitBill key="118837"
          // without the key, the split bill would keep the values when we first
          // select one person, and then change to another with he key ,
          // the values we entered in split bill resets when switching person
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

// Render a list of friends by mapping over the 'friends' array.
// Delegate friend selection handling to the Friend component, passing relevant props.
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    // We map the friends var which gets us the data from the initialFriends
    // from initialfriends we get the FUNCTION Friend
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          // key needs to be unique which the id is.
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

// function Friend should return the current friend object
// Function Friend will return the name of the friend/s
function Friend({ friend, onSelection, selectedFriend }) {
  //

  // i belive this means that the selectedFriend.id becomes the selectedFriend
  // if the selected friend has an id , then that ID will be the friend.id

  // else if selectedFriend does not have an id = null, then
  // they will also get the friend.id
  const isSelected = selectedFriend?.id === friend.id;

  return (
    // conditionally defines a classname
    // if isSelected is true provide class 'selected' else do nothing
    <li className={isSelected ? "selected" : ""}>
      <img
        src={friend.image}
        // alt text will return the same as the friends name
        alt={friend.name}
      />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        // we use Math.abs in order to display a positive number
        // (instead of displaying minus infron of negative numbers )
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

      {/* on selection we want to pass in the current friend*/}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  // emty state so that names can be entered by users of the website
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  // in order to prevent the default behaviour which
  // is to reload the full website
  function handleSubmit(e) {
    e.preventDefault();

    // if we have no name or if we have
    // no image, then we don't want the code below to run
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      id,
      image: `${image}?={id}`,
      balance: 0,
    };

    // At this point, the onAddFriend callback is called,
    // and the new friend object is passed as an argument
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input type="text" />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  // the default state is the "user" but can change to "you" manually
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    // nothing should happen if there either is NO bill OR no PaidByUser
    if (!bill || !paidByUser) return;
    // if the value is negative, then it should be payed by
    // user else payed by friend
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      {/* Split a bill with */}
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧔🏾 Your expense </label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      {/* This value is calculated based on Bill value and Your expense 
        therefore one should not be able to edit this field*/}
      <label>🧑‍🦰 {selectedFriend.name}'s expense </label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
