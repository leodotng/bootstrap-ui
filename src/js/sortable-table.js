(function ($) {
    'use strict';

  // SORTABLE TABLE CLASS DEFINITION
  // ===============================

  var SortableTable = function ($sortedTable, $navigation) {
    this.$sortedTable = $sortedTable;
    this.$navigation = $navigation;
  };

  SortableTable.prototype.sort = function ($sortedTh, sortDir) {
    var newSortGroup, sortGroup, colCount, $navigationUl, rowCounter;
    var rows = this.$sortedTable
      .find('tbody tr')
      .toArray()
      .sort(this.comparer($sortedTh.index()));

    this.$sortedTable.trigger('sort.sui.sortableTable');

    if ($sortedTh.hasClass('sorting-asc') && sortDir !== 'asc') {
      sortDir = 'desc';
    }
    this.$sortedTable
      .find('th')
      .removeClass('sorting-active')
      .removeClass('sorting-asc')
      .removeClass('sorting-desc');

    $sortedTh.addClass('sorting-active');
    if (sortDir === 'desc') {
      rows = rows.reverse();
      $sortedTh.addClass('sorting-desc');
    }
    else {
      $sortedTh.addClass('sorting-asc');
    }

    if (this.$navigation) {
      this.$navigation.find('ul').remove();
      this.$sortedTable.find('thead:gt(0)').remove();
      colCount = rows[0].childElementCount;
      if ($(rows[0]).children('td').eq($sortedTh.index()).data('sort-group')) {
        $navigationUl = $('<ul></ul>');
        this.$navigation.append($navigationUl);
      }
    }

    for (rowCounter = 0; rowCounter < rows.length; rowCounter++) {
      if (this.$navigation) {
        sortGroup = $(rows[rowCounter])
          .children('td')
          .eq($sortedTh.index())
          .data('sort-group');

        if (newSortGroup != sortGroup) {
          newSortGroup = sortGroup;
          $navigationUl.append('<li><a href="#letter-' + sortGroup + '">' + sortGroup + '</a></li>');
          this.$sortedTable.append($('<thead><tr class="active"><th colspan="' + colCount + '"><h2 class="h3" id="letter-' + newSortGroup + '">' + newSortGroup + '</h2></th></tr></thead>'));
          this.$sortedTable.append($('<tbody></tbody>'));
        }
      }
      this.$sortedTable.find('tbody:last').append(rows[rowCounter]);
    }
    this.$sortedTable.trigger('sorted.sui.sortableTable');
  };

  SortableTable.prototype.comparer = function(index) {
    return function(a, b) {
      var getCellValue = function(row, index) {
        var cell = $(row).children('td').eq(index);
        if (cell.attr('data-sort-value'))
          return cell.attr('data-sort-value');
        else {
          return cell.text();
        }
      };
      var valA = getCellValue(a, index);
      var valB = getCellValue(b, index);
      if ($.isNumeric(valA) && $.isNumeric(valB)) {
        return valA - valB;
      }
      else {
        return valA.localeCompare(valB);
      }
    };
  };


  // SORTABLE TABLE PLUGIN DEFINITION
  // ================================

  function Plugin(options) {
    var $element, data, $navigation;
    var sortedTh = options && ('sorted-th' in options) && options['sorted-th'] ? options['sorted-th'] : false;
    var sortDir = options && ('sort-direction' in options) && options['sort-direction'] ? options['sort-direction'] : false;

    return this.each(function () {
      $element = $(this);
      data = $element.data('sui.sortableTable');
      if (!data) {
        $navigation = options && ('navigation' in options) && options.navigation ? options.navigation : false;
        $element.data('sui.sortableTable', (data = new SortableTable($element, $navigation)));
      }
      if (sortedTh) {
        data.sort(options['sorted-th'], options['sort-direction']);
      }
    });
  }

  var old = $.fn.sortableTable;

  $.fn.sortableTable = Plugin;
  $.fn.sortableTable.Constructor = SortableTable;


  // SORTABLE TABLE NO CONFLICT
  // ==========================

  $.fn.sortableTable.noConflict = function () {
    $.fn.sortableTable = old;
    return this;
  };


  // SORTABLE TABLE DATA-API
  // =======================

  (function() {
    var callPlugin = function(e) {
      var $sortedTh = $(e.currentTarget);
      var $sortedTable = $sortedTh.closest('table');
      Plugin.call($sortedTable, {
        'sorted-th': $sortedTh,
        'navigation': $($sortedTable.data('sort-navigation'))
      });
    };

    $(document).on('click.sui.sortableTable.data-api', '[data-toggle=sort]', function(e) {
      callPlugin(e);
    });

    $(document).on('keydown.sui.sortableTable.data-api', '[data-toggle=sort]', function(e) {
      if (e.keyCode == 13 || e.keyCode == 32) { //enter or space
        callPlugin(e);
      }
    });
  }());

}(jQuery));
