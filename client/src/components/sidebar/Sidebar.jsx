import React from "react";
import { useSelector } from "react-redux";

function renderIconList(icons) {
  return icons.map(icon => {
   return <span className={`py-4 lnr lnr-${icon.name}`}
      style={ icon.isSelected ? {fontSize: 20, backgroundColor: '#e9e5e2'} : {fontSize: 20}}
    />
  })
}

export default function Sidebar() {
  const user = useSelector(state => state.user)
  const icons = [
    {
      name: 'history',
      isSelected: false
    },
    {
      name: 'home',
      isSelected: false
    },
    {
      name: 'users',
      isSelected: false
    },
    {
      name: 'bubble',
      isSelected: true
    },
    {
      name: 'inbox',
      isSelected: false
    },
    {
      name: 'store',
      isSelected: false
    },
  ]

  return (
    <div className="d-flex flex-column position-relative" style={{width: 80, height: "100%", backgroundColor: "#f0edeb"}}>
      <div className="d-flex justify-content-around my-2 mx-1">
        <div style={{height: 15, width: 15}} className="bg-danger rounded-circle" />
        <div style={{height: 15, width: 15}} className="bg-warning rounded-circle" />
        <div style={{height: 15, width: 15}} className="bg-success rounded-circle" />
      </div>

      <div className="text-center my-4">
        <span className="lnr lnr-diamond" style={{fontSize: 50}} />
      </div>

      <div className="d-flex flex-column text-center">
        {renderIconList(icons)}
      </div>

      <div className="d-flex flex-column text-center position-absolute" style={{bottom: 0, left: 0, right: 0, marginLeft: 0, marginRight: 0}}>
        <span className="lnr lnr-cog my-3" style={{fontSize: 20}} />

        <img
          style={{width: 40, height: 40}}
          className="rounded-circle border align-self-center mt-3 mb-4"
          src={user.profile_image_url || null}
          alt={user.name || null}
        />
      </div>
    </div>
  );
}
