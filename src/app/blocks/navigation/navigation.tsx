export default function navigation(){
  return(
    <div className="navigation">
      <ul className="nav-menu" id="navigation-menu">
        {navItem.map((item,index)=>{
          const hasDropdown = item.hasDropdownText && item.hasDropdownText.trim();
          const hasDropdownImg = hasDropdown && item.dropdownImg;
          const dropDownItems = parseDropdownItems(item.dropdownText);
        })}
      </ul>
      
    </div>
  )
}