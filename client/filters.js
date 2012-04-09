/*jslint vars: false, nomen: true */
/*global QBA: true, exports, $, Backbone, _ */

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
    var QBA = {};
}

if (typeof QBA.filters === 'undefined') {
    QBA.filters = {};
}

QBA.filters.filtersByType = {
    string: ["Equal", "Contains"],
    number: ["Equal", "Less than", "Greater than", "Between"],
    date: ["Equal", "Less than", "Greater than", "Between"],
    coord: []
};

QBA.filters.getFiltersFromType = function (type) {
    "use strict";
    var result;
    if (QBA.filters.filtersByType.hasOwnProperty(type)) {
        result = QBA.filters.filtersByType[type];
    } else {
        // Default
        result = ["Equal"];
    }
    return result;
};

QBA.filters.filterWidgets = {
    string: Backbone.View.extend({
        events: {
            "change input.filter-widget": "process"
        },

        render: function () {
            "use strict";
            var html = "<input type='text' class='filter-widget' name='filter_widget_" + this.model.get("number") + "'";
            if (!_.isUndefined(this.model.get("value")) && _.isString(this.model.get("value"))) {
                html += " value='" + this.model.get("value") + "'";
            }
            html += "/>";
            this.$el.append(html);
            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find("input.filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = this.$el.find("input.filter-widget").val();
            this.model.set({ value: value });
        }
    }),

    number: Backbone.View.extend({
        events: {
            "change input.filter-widget": "process"
        },

        render: function () {
            "use strict";
            var parameters = this.model.get("field").get("parameters"),
                html = "<div class='filter-widget range'></div>",
                value = this.model.get("value"),
                $el = this.$el,
                model = this.model;

            if (!_.isNumber(value)) {
                value = parameters.min;
            }

            html += "<input type='number' class='filter-widget' name='filter_widget_" + this.model.get("number") + "' min='" + parameters.min + "' max='" + parameters.max + "' step='" + parameters.step + "' value='" + value + "' />";
            this.$el.append(html);

            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = this.$el.find("input.filter-widget").val();
            this.model.set({ value: value });
        }
    }),

    number_range: Backbone.View.extend({
        render: function () {
            "use strict";
            var parameters = this.model.get("field").get("parameters"),
                html = "<div class='filter-widget range'></div>",
                value = this.model.get("value"),
                $el = this.$el,
                model = this.model;

            if (!_.isArray(value)) {
                value = [parameters.min, parameters.max];
            }

            html += "<span class='filter-widget hint'>(From " + parameters.min + " to " + parameters.max + ")</span>";
            html += "<input type='number' class='filter-widget range from' name='filter_widget_" + this.model.get("number") + "_from' min='" + parameters.min + "' max='" + parameters.max + "' step='" + parameters.step + "' disabled='true' value='" + value[0] + "' /> to ";
            html += "<input type='number' class='filter-widget range to' name='filter_widget_" + this.model.get("number") + "_to' min='" + parameters.min + "' max='" + parameters.max + "' step='" + parameters.step + "' disabled='true' value='" + value[1] + "' />";
            this.$el.append(html);

            this.$el.find("div.filter-widget.range").slider({
                range: true,
                min: parameters.min,
                max: parameters.max,
                step: parameters.step,
                values: value,
                slide: function (event, ui) {
                    $el.find("input.filter-widget.range.from").val(ui.values[0]);
                    $el.find("input.filter-widget.range.to").val(ui.values[1]);
                    model.set({ value: ui.values });
                }
            });

            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        }
    }),

    date: Backbone.View.extend({
        events: {
            "change input.filter-widget": "process"
        },

        render: function () {
            "use strict";
            var value = this.model.get("value"),
                html;

            if (!_.isString(value)) {
                value = "";
            }

            html = "<input type='date' class='filter-widget datepicker' name='filter_widget_" + this.model.get("number") + "' value='" + value + "'/>";
            this.$el.append(html);

            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = this.$el.find("input.filter-widget").val();
            this.model.set({ value: value });
        }
    }),

    date_range: Backbone.View.extend({
        events: {
            "change input.filter-widget.from": "process",
            "change input.filter-widget.to": "process"
        },

        render: function () {
            "use strict";
            var value = this.model.get("value"),
                html;

            if (!_.isArray(value)) {
                value = ["", ""];
            }

            html = "<input type='date' class='filter-widget from datepicker' name='filter_widget_" + this.model.get("number");
            html += "_from' value='" + value[0] + "'/>";
            html += "<span class='filter-widget'> to </span>";
            html += "<input type='date' class='filter-widget to datepicker' name='filter_widget_" + this.model.get("number");
            html += "_to' value='" + value[1] + "'/>";
            this.$el.append(html);
            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = [
                this.$el.find("input.filter-widget.from").val(),
                this.$el.find("input.filter-widget.to").val()
            ];
            this.model.set({ value: value });
        }
    })
};

QBA.filters.getFilterWidgetView = function (type, selected) {
    "use strict";
    var key = type,
        result;

    if ((selected === 3) && (type === "number" || type === "date")) {
        key += "_range";
    }

    if (QBA.filters.filterWidgets.hasOwnProperty(key)) {
        result = QBA.filters.filterWidgets[key];
    } else {
        // Default
        result = QBA.filters.filterWidgets.string;
    }

    return result;
};

QBA.filters.filterSPARQL = {
    text_equal: function (vble, value) {
        "use strict";
        return "str(" + vble + ") = " + value;
    },
    text_contains: function (vble, value) {
        "use strict";
        return "regex(str(" + vble + "), \"^.*" + value + ".*$\", \"i\")";
    },
    date_range_: function (vble, value) {
        "use strict";
        return value[0] + " < " + vble + " && " + vble + " < " + value[1];
    },
    number_range_: function (vble, value) {
        "use strict";
        return value[0] + " < " + vble + " && " + vble + " < " + value[1];
    }
};

QBA.filters.getFilterSPARQL = function (filter) {
    "use strict";
    return QBA.utils.filterSPARQL[filter.get("widget") + "_" + filter.get("code")];
};

// Browser
if (typeof exports !== "undefined") {
    exports.getFilterWidgetView = QBA.filters.getFilterWidgetView;
}
