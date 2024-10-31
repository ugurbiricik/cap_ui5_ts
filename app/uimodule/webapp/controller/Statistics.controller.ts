import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import BlockLayout from "sap/ui/layout/BlockLayout";


export default class Statistics extends BaseController {
    public onInit(): void {
        const oViewModel = new JSONModel({
            ColumnChartData: [{ v: 80 }, { v: 150 }, { v: 400 }, { v: 200 }],
            ColumnChartData2: [{ v: 40 }, { v: 320 }, { v: 270 }, { v: 140 }, { v: 60 }],
            ComparisonChartData: [{ v: 120 }, { v: -67 }, { v: 250 }, { v: -80 }],
            ComparisonChartData2: [{ v: -70 }, { v: 170 }, { v: -30 }, { v: 60 }, { v: 120 }],
            PieChartData: [{ v: 83 }],
            PieChartData2: [{ v: 57 }]
        });
        this.setModel(oViewModel, "view");
    	}

    public onRefresh(): void {
        const oCharts = this.byId("charts") as View;
        if (oCharts) {
            const oBlockLayout = oCharts.byId("statisticsBlockLayout") as BlockLayout;
            oBlockLayout?.invalidate();
            oBlockLayout?.setBusy(true);

            setTimeout(() => {
                oBlockLayout?.setBusy(false);
            }, 2000);
        }
    }
}
