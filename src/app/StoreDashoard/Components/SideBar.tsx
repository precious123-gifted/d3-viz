import Image from "next/image";
import notificationIcon from "../assets/notification-icon.png"
import dashboardIcon from "../assets/dasboard-logo.png"
import productsIcon from "../assets/products-icon.png"
import statisticsIcon from "../assets/statistics-icon.png"
import customersIcon from "../assets/customers-icon.png"
import helpIcon from "../assets/help-icon.png"
import settingsIcon from "../assets/settingsicon.png"
import logo from "../assets/logo.png"
import profileImage from "../assets/photo_5963320722380146182_y.jpg"




export default function SideBar() {
  return (
    <>
    <div className="content w-[18vw] h-[74vh] bg-[#40473A] rounded-md p-3 mr-10">
      

<div className="notification-logo-div flex mb-9 justify-between"><span className="cursor-pointer"><Image src={notificationIcon} alt="notification icon" className="w-[1vw]"/> </span><span className="cursor-pointer"><Image src={logo} alt="logo" className="w-[2vw]"/> </span></div>
<div className="profile-image-div flex items-center space-x-3 mb-9">
<div className="profile-image w-12 h-12 rounded-full bg-[#3c4d3d] relative">
  <Image src={profileImage} alt="profile image" layout="fill" objectFit="cover" quality={100} className="rounded-full opacity-40"/>
  </div><div className="name-title-div flex flex-col text-[#97A8A2]">
<span className="name text-[0.8vw] ">Precious OG</span>
<div className="title text-[0.6vw]">Admin</div>


</div>
</div>


<div className="pages-list-div flex flex-col text-[#97A8A2] space-y-6 mb-9">
<div className="dashboard cursor-pointer border-[#97A8A2] border-2  px-3 py-1 rounded-sm flex items-center space-x-3"><span className="cursor-pointer"><Image src={dashboardIcon} alt="notification icon" className="w-[1vw]"/> </span><span className="text-[1vw] cursor-pointer">Dashboard</span></div>
<div className="products cursor-pointer border-[#97A8A2] border-2  px-3 py-1 rounded-sm flex items-center space-x-3"><span className="cursor-pointer"><Image src={productsIcon} alt="notification icon" className="w-[1vw]"/> </span><span className="text-[1vw] cursor-pointer">Products</span></div>
<div className="statistics cursor-pointer border-[#97A8A2] border-2  px-3 py-1 rounded-sm flex items-center space-x-3"><span className="cursor-pointer"><Image src={statisticsIcon} alt="notification icon" className="w-[1vw]"/> </span><span className="text-[1vw] cursor-pointer">Statistics</span></div>
<div className="customers cursor-pointer border-[#97A8A2] border-2  px-3 py-1 rounded-sm flex items-center space-x-3"><span className="cursor-pointer"><Image src={customersIcon} alt="notification icon" className="w-[1vw]"/> </span><span className="text-[1vw] cursor-pointer">Customers</span></div>
<div className="help cursor-pointer border-[#97A8A2] border-2  px-3 py-1 rounded-sm flex items-center space-x-3"><span className="cursor-pointer"><Image src={helpIcon} alt="notification icon" className="w-[1vw]"/> </span><span className="text-[1vw] cursor-pointer">Help</span></div>


</div>
<div className="settings-mode-div text-[#97A8A2] justify-self-start">
<div className="settings border-[#97A8A2] border-2  px-3 py-1 rounded-sm flex items-center space-x-3"><span className="cursor-pointer"><Image src={settingsIcon} alt="notification icon" className="w-[0.8vw]"/> </span><span className="text-[0.8vw] cursor-pointer">Settings</span></div>

</div>




    </div>
    
    </>
  )
}
