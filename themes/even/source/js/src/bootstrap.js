$(document).ready(function () {
  Even.fancybox.register();
  Even.mobileNavbar.register();
  Even.search.register();
  Even.postToc.register();
  Even.backToTop.register();

  var path = location.pathname;
  var menuItems = $('.site-nav .menu-item');
  if (path === '/'） {
    $(menuItems[0]).addClass('active');
  } else if (/archives\/$/i.test(path)) {
    $(menuItems[1]).addClass('active');
  } else if (/tags\/$/i.test(path)) {
    $(menuItems[2]).addClass('active');
  } else if (/about\/$/i.test(path)) {
    $(menuItems[3]).addClass('active');
  }
})
