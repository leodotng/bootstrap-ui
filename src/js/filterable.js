// Prevent jshinf from raising the "Expected an assignment or function call and instead saw an expression" warning
// jshint -W030

+function ($) {
    'use strict';

  // FILTERABLE CLASS DEFINITION
  // ======================
  var Filterable = function ($filterable) {
    this.$filterable = $filterable;
  };

  Filterable.prototype.filter = function (fObjects) {
    $(document).trigger('filter.sui.filterable', [this.$filterable]);
    this.$filterable.show();
    this.$filterable.each(function(dataIndex, dataEl) {
      for (var i1 = 0; i1 < fObjects.length; i1++) {
        var fObj = fObjects[i1];
        var dataElAttribVal = $(dataEl).data(fObj['filter-attrib']);
        if (dataElAttribVal) {
          var hideEl = false;

          if (fObj['filter-operator'] == 'subset') {
            for (var i2 = 0; i2 < fObj['filter-value'].length; i2++) {
              if (dataElAttribVal.indexOf(fObj['filter-value'][i2]) === -1) {
                hideEl = true;
                break;
              }
            }
          }

          else if (fObj['filter-operator'] == 'intersect') {
            hideEl = true;
            if (typeof(fObj['filter-value']) === 'string') {
              fObj['filter-value'] = [fObj['filter-value']];
            }
            if (typeof(dataElAttribVal) === 'string') {
              dataElAttribVal = [dataElAttribVal];
            }
            for (var i3 = 0; i3 < fObj['filter-value'].length; i3++) {
              for (var i4 = 0; i4 < dataElAttribVal.length; i4++) {
                if (dataElAttribVal[i4].indexOf(fObj['filter-value'][i3]) !== -1) {
                  hideEl = false;
                  break;
                }
              }
            }
          }

          else if (
            (fObj['filter-operator'] === '=' && +dataElAttribVal !== +fObj['filter-value']) ||
            (fObj['filter-operator'] === '>=' && +dataElAttribVal < +fObj['filter-value']) ||
            (fObj['filter-operator'] === '<=' && +dataElAttribVal > +fObj['filter-value']) ||
            (fObj['filter-operator'] === '<' && +dataElAttribVal >= +fObj['filter-value']) ||
            (fObj['filter-operator'] === '>' && +dataElAttribVal <= +fObj['filter-value'])
          ) {
            hideEl = true;
          }

          if (hideEl === true) {
            $(dataEl).hide();
          }
        }
      }
    });
    $(document).trigger('filtered.sui.filterable', [this.$filterable]);
  };

  Filterable.prototype.reset = function () {
    $(document).trigger('resetStart.sui.filterable', [this.$filterable]);
    this.$filterable.show();
    $(document).trigger('resetEnd.sui.filterable', [this.$filterable]);
  };


  // FILTERABLE PLUGIN DEFINITION
  // =======================

  function Plugin(options) {
    var $this = $(this);

    var data = $this.data('sui.filterable');
    if (!data) {
      $this.data('sui.filterable', (data = new Filterable($this)));
    }

    if (options === 'reset') {
      data.reset();
    } else {
      data.filter(options);
    }
  }

  var old = $.fn.filterable;

  $.fn.filterable = Plugin;
  $.fn.filterable.Constructor = Filterable;


  // FILTERABLE NO CONFLICT
  // =================

  $.fn.filterable.noConflict = function () {
    $.fn.filter = old;
    return this;
  };


  // FILTERABLE DATA-API
  // ==============

  $(document).on('change.sui.filterable.data-api', '[data-toggle=filter]', function(e) {
    var $filter = $(this).closest('form');

    var filterData = [];
    $filter.find(':input').each(function(index, filterInput) {
      var $filterInput = $(filterInput);
      if ($filterInput.val() !== '' && $filterInput.val() !== null) {
        filterData.push({
          'filter-attrib': $filterInput.data('filter-attrib'),
          'filter-operator': $filterInput.data('filter-operator'),
          'filter-value': $filterInput.val()
        });
      }
    });

    $filter.find('[type=reset]').click(function(){
      Plugin.call($($filter.data('target')), 'reset');
    });

    Plugin.call($($filter.data('target')), filterData);
  });

}(jQuery);
