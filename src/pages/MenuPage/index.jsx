import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./components/Header";
import Banner from "./components/Banner";

function Menu() {
  const [menus, setMenus] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const token = localStorage.getItem('Token');
  const navigate = useNavigate();
  let url = "https://localhost:44327/api/Menus/all?currentPage=1&pageSize=8";

  const fetchMenusData = async () => {
    const res = await fetch("https://localhost:44327/api/Menus/all?currentPage=1&pageSize=3", {
      mode: 'cors', method: 'GET', headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      setMenus(data.items);
    }
  }
  const fetchHeroData = async () => {     
    const res = await fetch("https://localhost:44327/api/Menus/all?currentPage=1&pageSize=3", { mode: 'cors', method: 'GET', headers: new Headers({
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })});
    if(res.status === 200){
        const data = await res.json();
        setHeroes(data.items);
    }
  }
  const getMenu = (id) => {
    navigate('/', {state: {Id: id}});
}
  useEffect(() => {
    if (localStorage) {
      var role = localStorage.getItem('Role');
      if (role !== 'USER') {
        navigate('/');
      } else {
        fetchHeroData();
        fetchMenusData();
      }
    }
  }, [])
  return (
    <div className="w-full">
      <Header />
      <Banner />
      <div>
        {menus.length > 0 && (
            <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6">
              {heroes.map(menu => (
                  <div key={menu.id} className="rounded-xl relative">
                      {/* Overlay */}
                      <div className="absolute w-full h-full bg-black/50 rounded-xl text-white">
                          <p className="font-bold text-2xl px-2 pt-4">{menu.menuName}</p>
                          <br></br>
                          <button onClick={() => getMenu(menus.id)} className="border border-white rounded-xl px-5 py-1 bg-white text-black mx-2 absolute bottom-4">
                            Xem chi tiết!</button>
                      </div>
                      <img className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl" src="https://as1.ftcdn.net/v2/jpg/03/14/55/62/1000_F_314556236_hRwCkoZIayHyTW4IBjIizEaX8vc7XwV5.jpg" alt="/" />
                  </div>
              ))}
            </div>
        )}
        </div>
        <div className="max-w-[1640px] m-auto px-4 py-12">
          <h1 className="text-orange-600 font-bold text-4xl text-center">Các thực đơn phổ biến</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {menus.map(menu => (
              <div key={menu.id} className="border shadow-lg hover:scale-105 duration-300 rounded-lg">
                <img src="https://as1.ftcdn.net/v2/jpg/03/14/55/62/1000_F_314556236_hRwCkoZIayHyTW4IBjIizEaX8vc7XwV5.jpg" alt="/" className="w-full h-[200px] object-cover rounded-t-lg" />
                <div className="flex justify-between px-2 py-4">
                  <p className="font-bold">{menu.menuName}</p>
                  <p>
                    <span className="bg-orange-500 text-white p-1 rounded-full"></span>
                  </p>
                  </div>
              </div>
          ))}
        </div>
        <br></br>
        <br></br>
    </div>
  );

}

export default Menu;