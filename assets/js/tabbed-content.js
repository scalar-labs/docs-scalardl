/* ==========================================================================
   Tabbed content support (added by josh-wong)
   ========================================================================== */
function openTab(evt, tabName, setName) {    
  var i, tabcontent, tablinks;

  var set = document.getElementById(setName);

  // Clear the previously selected tab.
  tabcontent = set.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Set the tab to "active".
  tablinks = set.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Display the selected tab and set it to active.
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it.
document.getElementById("defaultOpen-1").click();
document.getElementById("defaultOpen-2").click();
document.getElementById("defaultOpen-3").click();
document.getElementById("defaultOpen-4").click();
document.getElementById("defaultOpen-5").click();
document.getElementById("defaultOpen-6").click();
document.getElementById("defaultOpen-7").click();
document.getElementById("defaultOpen-8").click();
document.getElementById("defaultOpen-9").click();
document.getElementById("defaultOpen-10").click();
