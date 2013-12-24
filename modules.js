M_O_D_U_L_E_S = {
  settings: {
    toolbar: $('<div class="mod___toolbar________"></div>')
  },

  init: function() {
    this.settings['boxes'] = $('.mod___box________');
    this.settings['groups'] = $('.mod___group________');
    this.settings['todos'] = this.settings['boxes'].add(this.settings['groups']);

    // Prepennd
    $('body').prepend('<span class="mod___btn___main___expand________">Expand all / collapse all</span><span class="mod___btn___main___zoom50________">Zoom 50%</span><div id="mod___clipboard________">Pulsa <b>Ctrl+C</b> para copiar.<br><b>Intro</b> para <a href="#" id="mod___btn___clpbrd___close">cerrar</a>.<textarea name="clpbrd" id="clpbrd" cols="30" rows="10"></textarea></div><div id="mod___info________">Markdown will show here</div><pre id="mod___code________" class="prettyprint lang-html">HTML code will shown here</pre>');

    this.initBoxes();
    //this.initGroups();
    //this.addToolbar();
    //this.autoCloseInfo();
  },

  initBoxes: function() {
    this.settings.boxes.each(function(index, el) {
      M_O_D_U_L_E_S.storeMarkdown(el);
      M_O_D_U_L_E_S.storeHTML(el);
    });
    this.initGroups();
  },

  initGroups: function() {
    this.settings.groups.each(function(index, el) {
      M_O_D_U_L_E_S.storeMarkdown(el);
    });
    this.addToolbar();
  },

  addToolbar: function() {
    this.settings.todos.each(function(index, el) {
      var
        el = $(el),
        toolbar = $('<div class="mod___toolbar________"></div>'),
        tit = $('<h5 class="mod___toolbar___title________">'+el.data('title')+'</h5>');
        btne = $('<span class="mod___btn________">+</span>');

      btne.on('click', function(event) {
        event.preventDefault();
        $(this).parent().parent().toggleClass('collapsed');
      });

      tit.on('click', function(event) {
        event.preventDefault();
        $(this).parent().parent().toggleClass('collapsed');
      });

      el.prepend(toolbar.append(tit).append(btne));

      // If is group
      if (el.hasClass('mod___group________')) {
        var btnea = $('<span class="mod___btn________">Expand all</span>');
        btnea.on('click', function(event) {
          event.preventDefault();
          $(this).parent().parent().removeClass('collapsed').find('.mod___box________').removeClass('collapsed');
        });
        toolbar.append(btnea);
      } else {
        // Is box
        // Copy HTML to clipboard
        var btncopy = $('<span class="mod___btn________ colb">Copy</span>');
        btncopy.on('click', function(event) {
          event.preventDefault();
          M_O_D_U_L_E_S.copyToClipboard($(this).parent().parent()[0].box_html);
        });
        toolbar.append(btncopy);
      }

      // Code button
      var
        html = el[0].box_html,
        mark = el[0].box_markdown,
        btncode = $('<span class="mod___btn________ cola">Info</span>');

      btncode.on('click', function(event) {
        event.preventDefault();

        /*var
          html = $(this).parent().parent()[0].box_html
          mark = $(this).parent().parent()[0].box_markdown;*/

        // Show Markdown info
        if (mark !== undefined) {
          var MDC = new Showdown.converter();
          $('#mod___info________').html(MDC.makeHtml(mark)).show();
        }

        // Show HTML
        if (html !== undefined) {
          document.getElementById("mod___code________").innerHTML = M_O_D_U_L_E_S.escapeHTML(html.trim());
          $('#mod___code________').show();
          // Hightlight code
          $('.prettyprinted').removeClass('prettyprinted');
          prettyPrint();
          $('html').css('overflow', 'hidden');
        }
      });
      if (mark !== undefined || html !== undefined) {
        toolbar.append(btncode);
      }

    });
    this.autoCloseInfo();
  },

  storeMarkdown: function (el) {
    var
      el = $(el),
      dt_ = el.find('> dt'),
      tit = "# " + el.data('title') + "\n\n";

    if (dt_.length > 0) {
      el[0].box_markdown = tit + dt_.html();
      dt_.remove();
    }
  },

  storeHTML: function(el) {
    // html
    var
      el = $(el),
      html_ = el.find('> dd');

    if (html_.length > 0) {
      el[0].box_html = html_.html().toString();
    }
  },

  escapeHTML: function (texto) {
    return(
      texto.replace(/>/g,'&gt;').
           replace(/</g,'&lt;').
           replace(/"/g,'&quot;')
    );
  },

  copyToClipboard: function (text) {
    //window.prompt ("Copiar al portapapeles: Ctrl+C, Enter", text);
    $('#mod___clipboard________').show().find('> textarea').text(text).focus().select();
  },

  collapseAll: function () {
    this.settings.todos.addClass('collapsed');
    $('.mod___btn___main________').addClass('closed');
  },

  expandAll: function () {
    this.settings.todos.removeClass('collapsed');
    $('.mod___btn___main________').removeClass('closed');
  },

  expandChildren: function (el) {

  },

  autoCloseInfo: function() {
    // Autoclose
    var panels = $('#mod___info________, #mod___code________');
    panels.on('click', function(){
      $('#mod___info________, #mod___code________').hide();
      $('html').css('overflow', 'auto');
    });

    // Main expand
    $('span.mod___btn___main___expand________').on('click', function (e) {
      e.preventDefault();
      if ($(this).hasClass('closed')) {
        $('.mod___group________').removeClass('collapsed');
        $('.mod___box________').removeClass('collapsed');
        $(this).removeClass('closed');
      } else {
        $('.mod___group________').addClass('collapsed');
        $('.mod___box________').addClass('collapsed');
        $(this).addClass('closed');
      }
    });

    // Zoom 50%
    $('span.mod___btn___main___zoom50________').on('click', function(e) {
      e.preventDefault();
      $('body').toggleClass('mod___body___zomm50________');
    });
    this.callback();
  },

  callback: function() {
    // Se ejecuta al final del todo
  }

};

$(document).ready(function() {
  // Magic here!
  // End action this is executed when all is finished
  M_O_D_U_L_E_S.callback = function() {
    //console.log('eo');
    $('body').append('<script src="javascripts/all.js" type="text/javascript"></script>');
  };
  // Initialize modules mandanga
  M_O_D_U_L_E_S.init();
});

$(window).load(function() {
  M_O_D_U_L_E_S.collapseAll();
  // Hide clipboard
  $(document).keypress(function(e) {
    if(e.which == 13) {
      $('#mod___clipboard________').hide();
    }
    if(e.which == 27) {
      $('#mod___info________, #mod___code________').hide();
      $('html').css('overflow', 'auto');
    }
  });
});

