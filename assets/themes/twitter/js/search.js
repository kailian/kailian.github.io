$(function() {
  $.ajax({
    url: "/search.xml",
    dataType: "xml",
    success: function( xmlResponse ) {
     var data = $( "article", xmlResponse ).map(function() {
        return {
          value: $( "title", this ).text() + ", " +
              ( $.trim( $( "date", this ).text() ) ),
          url: $("url", this).text()
        };
      }).get();

      $( "#blog-search" ).autocomplete({
        source: data,
        minLength: 0,
        select: function( event, ui ) {
          window.location.href = ui.item.url;
        }
      });
    }
  });
});
