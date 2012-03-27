/*jslint vars: false, browser: true */
/*global QBA: true, $, alert */

// Copyright 2012 Yaco Sistemas S.L.
//
// Developed by Yaco Sistemas <ablanco@yaco.es>
//
// Licensed under the EUPL, Version 1.1 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
// You may not use this work except in compliance with the
// Licence.
// You may obtain a copy of the Licence at:
//
// http://joinup.ec.europa.eu/software/page/eupl
//
// Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
// See the Licence for the specific language governing
// permissions and limitations under the Licence.

if (typeof QBA === 'undefined') {
    window.QBA = {};
}

QBA.events = {
    views: {},

    navigation: function () {
        "use strict";
        $("li.tab a").click(function () {
            var step = this.href.split('#')[1],
                view;

            // Release old events of the target tab
            QBA.events[step].release();

            if (typeof QBA.events.views[step] === "undefined") {
                $.template(step, $("#" + step + "Tpl").html());
                view = new QBA.views.Step({
                    el: $('#' + step)[0],
                    step: step
                });
                QBA.events.views[step] = view;
            } else {
                view = QBA.events.views[step];
            }
            view.render();

            // Bind events to the new content of the target tab
            QBA.events[step].bind();
        });
    },

    step1: {
        bind: function () {
            "use strict";
            $("#step1 input[type=checkbox]").change(function () {
                // collection has 10 chars
                var success = false,
                    indexes = this.name.substr(10).split('-'),
                    category = QBA.theQuery.at(parseInt(indexes[0], 10)),
                    collection;

                if (category) {
                    collection = category.get("collectionList").at(parseInt(indexes[1], 10));
                    if (collection) {
                        collection.set("checked", this.checked);
                        success = true;
                    }
                }

                if (!success) {
                    // TODO error
                    alert('error');
                }
            });
        },

        release: function () {
            "use strict";
            // TODO
        }
    },

    step2: {
        bind: function () {
            "use strict";
            $("#step2 input[type=checkbox]").change(function () {
                // field has 5 chars
                var success = false,
                    indexes = this.name.substr(5).split('-'),
                    category = QBA.theQuery.getCategoriesWithCheckedCollections()[parseInt(indexes[0], 10)],
                    collection,
                    field;

                if (category) {
                    collection = category.getCheckedCollections()[parseInt(indexes[1], 10)];
                    if (collection) {
                        field = collection.get("fieldList").at(parseInt(indexes[2], 10));
                        if (field) {
                            field.set("checked", this.checked);
                            success = true;
                        }
                    }
                }

                if (!success) {
                    // TODO error
                    alert('error');
                }
            });
        },

        release: function () {
            "use strict";
            // TODO
        }
    },

    step3: {
        filtersCounter: 0,

        getFilters: function (catIdx, fieldName) {
            "use strict";
            var category = QBA.theQuery.getCategoriesWithCheckedCollections()[catIdx],
                fields = category.get("fieldList"),
                field;

            field = fields.filter(function (field) {
                return field.get("name") === fieldName;
            })[0];

            return field.get("filterList");
        },

        updateFilterWidget: function (context, filters) {
            "use strict";
            var filter = filters[parseInt(context.selectedOptions[0].value, 10)],
                html = QBA.utils.getFilterWidgetHTML(filter),
                parentElement = $(context.parentElement);

            parentElement.find(".filter-widget").remove();
            parentElement.append(html);
        },

        updateFilterTypes: function () {
            "use strict";
            var indexes = this.selectedOptions[0].value.split('-'),
                filters = QBA.events.step3.getFilters(
                    parseInt(indexes[0], 10),
                    this.selectedOptions[0].innerHTML
                ),
                filterIdx = this.name.split('_'),
                html = "<select name='filter_type_" + filterIdx[filterIdx.length - 1] + "' class='filter-type'>",
                parentElement;

            filters.each(function (filter, i) {
                html += "<option value='" + i + "'>" + filter.get("name") + "</option>";
            });

            html += "</select>";

            parentElement = $(this.parentElement);
            parentElement.find("select.filter-type").remove();
            parentElement.append(html);

            parentElement.find("select.filter-type").change(function () {
                QBA.events.step3.updateFilterWidget(this, filters);
            });
            parentElement.find("select.filter-type").trigger("change");
        },

        bind: function () {
            "use strict";
            var categories = QBA.theQuery.getCategoriesWithCheckedCollections(),
                category,
                collections,
                disabled = true,
                i,
                j;

            // Look for checked fields, if none the button will be disabled
            for (i = 0; i < categories.length && disabled; i += 1) {
                category = categories[i];
                collections = category.getCheckedCollections();
                for (j = 0; j < collections.length && disabled; j += 1) {
                    disabled = collections[j].getCheckedFields().length === 0;
                }
            }

            $("#step3 #new_filter").attr("disabled", disabled).click(function (evt) {
                var html = $("#step3 #filterTpl").html(),
                    container = $("<div class='filter'></div>");

                evt.stopPropagation();
                evt.preventDefault();
                html = html.replace("######", QBA.events.step3.filtersCounter);
                QBA.events.step3.filtersCounter += 1;

                container.append(html);
                container.find("select.filter-field").change(QBA.events.step3.updateFilterTypes);
                container.find("select.filter-field").trigger("change");
                $("#step3 #filters").append(container);
            });
        },

        release: function () {
            "use strict";
            // TODO
        }
    },

    step4: {
        bind: function () {
            "use strict";
            // TODO
        },

        release: function () {
            "use strict";
            // TODO
        }
    }
};
