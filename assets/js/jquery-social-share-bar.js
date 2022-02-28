/**
 * jquery-social-share-bar
 * Copyright: Jesse Nieminen, Viima Solutions Oy
 * 
 * License: MIT
 * --------------------
 * Modified from https://github.com/ewebdev/jquery-share
 */

(function ($, window, undefined) {
  "use strict";

  $.fn.share = function (method) {

    var helpers = {
      channels: {
        share: { url: '#[u]' },
      }
    };

    var methods = {

      init: function (options) {
        this.share.settings = $.extend({}, this.share.defaults, options);

        var settings = this.share.settings,
          pageTitle = settings.title || document.title || '',
          pageUrl = settings.pageUrl || window.location.href,
          pageDesc = settings.pageDesc || $('head > meta[name="description"]').attr("content") || '',
          position = 'center',
          theme = settings.theme || 'circle',
          animate = settings.animate === false ? false : true,
          u = encodeURIComponent(pageUrl),
          t = encodeURIComponent(pageTitle);

        // Each instance of this plugin
        return this.each(function () {
          var $element = $(settings.containerTemplate(settings)).appendTo($(this)),
            id = $element.attr("id"),
            d = pageDesc.substring(0, 250),
            href;

          // Add class for positioning and animation of the widget
          $(this).addClass(position);
          if (animate) {
            $(this).addClass('animate');
          }

          // Add class for theming the widget
          $element.addClass(theme);

          // Append HTML for each network button
          for (var item in settings.channels) {
            item = settings.channels[item];
            href = helpers.channels[item].url;
            href = href.replace('|u|', u).replace('|t|', t).replace('|d|', d)
              .replace('|140|', t.substring(0, 130));
            $(settings.itemTemplate({ provider: item, href: href, itemTriggerClass: settings.itemTriggerClass })).appendTo($element);
          }

          // Bind click
          $element.on('click', '.' + settings.itemTriggerClass, function (e) {
            e.preventDefault();
            $.each(this.attributes, function () {

            });
            var provider = false;
            $(this).each(function() {
              $.each(this.attributes, function() {
                // this.attributes is not a plain object, but an array
                // of attribute nodes, which contain both the name and value
                if(this.specified) {
                  if (this.name == 'data-provider')
                   provider = this.value;
                }
              });
            });
            if (provider === 'share') {
              if (navigator.share) {
                // Web Share API is supported
                navigator.share({
                  title: 'Attack Putin\'s Propaganda ',
                  url: 'https://www.attackputin.com'
                }).then(() => {
                  console.log('Thanks for sharing!');
                })

              } else {
                // Fallback
                alert("Mobile only.")
              }

            } else {
              var top = (screen.height / 2) - (settings.popupHeight / 2),
                left = (screen.width / 2) - (settings.popupWidth / 2);
              window.open($(this).data('href') || $(this).attr('href'), 't', 'toolbar=0,resizable=1,status=0,copyhistory=no,width=' + settings.popupWidth + ',height=' + settings.popupHeight + ',top=' + top + ',left=' + left);
            }
          });

        });// End plugin instance

      }
    };

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method "' + method + '" does not exist in social plugin');
    }

  };

  $.fn.share.defaults = {
    popupWidth: 640,
    popupHeight: 528,
    channels: ['share'],
    itemTriggerClass: 'js-share',
    containerTemplate: function (props) {
      return '<ul class="sharing-providers"></ul>';
    },

    itemTemplate: function (props) {
      var iconClasses = {
        'facebook': 'fab fa-facebook-f',
        'twitter': 'fab fa-twitter',
        'linkedin': 'fab fa-linkedin-in',
        'googleplus': 'fab fa-google-plus-g',
        'pinterest': 'fab fa-pinterest-p',
        'tumblr': 'fab fa-tumblr',
        'stumbleupon': 'fab fa-stumbleupon',
        'reddit': 'fab fa-reddit-alien',
        'share': 'fa fa-share-alt',
        'digg': 'fab fa-digg',
        'email': 'fas fa-envelope',
      }

      // Special handling for email and Google+
      var providerName = props.provider === 'email' ? 'email' : props.provider === 'googleplus' ? 'Google+' : props.provider.charAt(0).toUpperCase() + props.provider.slice(1);

      return '<li class="' + props.provider + '">' +
        '<a href="#" data-href="' + props.href + '" title="Share this page ' + (props.provider === 'email' ? 'via ' : 'on ') + providerName + '" class=' + props.itemTriggerClass + ' ' + 'data-provider="'+ props.provider + '" ' + props.provider + '">' +
        '<i class="' + iconClasses[props.provider] + '"></i>' +
        '</a>' +
        '</li>';
    }
  };

  $.fn.share.settings = {};

})(jQuery, window);

