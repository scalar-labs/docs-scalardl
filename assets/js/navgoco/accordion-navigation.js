function findDataIndexByHref(navElement, url) {
  const anchors = navElement.querySelectorAll('a');

  for (let i = 0; i < anchors.length; i++) {
      let cleanHref = anchors[i].href.replace(/^file:\/\//i, '');
      if (url.endsWith(cleanHref)) {
          const targetAnchor = anchors[i];
          let currentElement = targetAnchor.parentElement;
          while (currentElement && currentElement.tagName !== 'UL') {
              currentElement = currentElement.parentElement;
          }
          if (currentElement && currentElement.hasAttribute('data-index')) {
              return currentElement.getAttribute('data-index');
          }
      }
  }
  return null; // No match found
}

// Navgoco accordion navigation (added by josh-wong)
$(document).ready(function() {
  $('.nav__items').navgoco({
    caretHtml: '',
    accordion: true,
    openClass: 'open',
    save: true,
    cookie: {
      name: 'navgoco',
      expires: false,
      path: '/'
    },
    slide: {
      duration: 300,
      easing: 'swing'
    }
  });
  
  // The following click functions are from Tom Johnson's docs theme. These lines here may be useful in getting the side navigation to expand when users visit from a different browser or new session: https://github.com/tomjoht/documentation-theme-jekyll/blob/fa31ffc73c26928c8ead0b448dec259123db9966/_layouts/default.html#L24
  // $("#collapseAll").click(function(e) {
  //   e.preventDefault();
  //   $(".nav__items").navgoco('toggle', false);
  // });

  // $("#expandAll").click(function(e) {
  //   e.preventDefault();
  //   $(".nav__items").navgoco('toggle', true);
  // });
  
  const navElement = document.querySelector('.nav__list');
  const index = findDataIndexByHref(navElement, window.location.href);
  $('.nav__items').navgoco('toggle', true, index);
});

// $( "#activePage" ).accordion({
//     heightStyle: "content",
//     active: false,
//     collapsible: true,
//     header:"nav.nav__items"
//   });
//   var hash = window.location.hash;
//   var anchor = $('a[href$="'+hash+'"]');
//   if (anchor.length > 0){
//     anchor.click();
// }



// Open the side navigation accordion based on the active page.
// The following doesn't work.
// $(function() {
//   var activeTab = 0;
//   $(".nav__sub-title .nav__list .nav__items a").each(function(i, el) {
//     if ($(el).find("open").length) {
//       activeTab = i;
//     }
//   });
//   $(".nav__sub-title").accordion({
//     active: activeTab
//   });
// });

// The following doesn't work.
// var parentList= $('#active-link').closest('ul');

// while (parentList.length > 0) {
//     parentList.prev('a').addClass('active');

//     parentList = parentList.closest('ul');

// Scrolls to active item in side navigation
// The following doesn't work.
// $(function(){

//   setInterval(function(){
//      window.location.reload();
//   },90000);
  
//    var scroll = window.localStorage && window.localStorage.getItem('.nav__items.scrollTop');
//    $('.nav__list + .nav__items + a + .active').scrollTop(scroll);

//   $('.nav__list + .nav__items + a + .active').on('scroll', function () {
//     var scroll = $('.nav__list + .nav__items + a + .active').scrollTop();
//     return window.localStorage && window.localStorage.setItem('.nav__items.scrollTop', scroll);
//   });
 
// });
