import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Sorter from "sap/ui/model/Sorter";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Event from "sap/ui/base/Event";
import * as library from "sap/m/library";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import ListBinding from "sap/ui/model/ListBinding";
import { ProductActions } from "./ProductActions.controller";



export default class Products extends Controller {
    private oModel!: ODataModel;
    private productActions!: ProductActions;

    public onInit(): void {
        this.initializeModels();
        this.setupEventListeners();
        this.updateProductList();
        this.updateVisiblePagesCount();

        this.productActions = new ProductActions(this.oModel, this.getView());
    }

    private initializeModels(): void {
        const oCartModel = new JSONModel({
        });
        this.getView()?.setModel(oCartModel, "cartModel");
        this.oModel = this.getOwnerComponent()?.getModel("mainServiceModel") as ODataModel;
        var oListBinding = this.oModel.bindList("/Products");
        const oSorter = new Sorter("Name", false);
        oListBinding.sort([oSorter]);
        oListBinding.requestContexts().then((aContexts: any[]) => {
            const productCount = aContexts.length
            const aProducts = aContexts.map((oContext: any) => oContext.getObject());
            const oProductModel = new JSONModel({ products: aProducts });
            this.getView()?.setModel(oProductModel, "productsModel");
            const oProductCountModel = new JSONModel({ productCount });
            this.getView()?.setModel(oProductCountModel, "productCountModel");
        }).catch((error: any) => {
            console.error("Ürünleri getirirken hata oluştu: " + error.message);
        });


        
        const oNewProductModel = new JSONModel({
            newProduct: {
                Name              : "",    
                Status            : "",     
                SupplierName      : "",  
                MainCategory      : "",   
                Category          : "",   
                Width             : "",  
                Height            : "",  
                WeightMeasure     : "",  
                ProductPicUrl     : ""
            }
        });
        this.getView()?.setModel(oNewProductModel, "newProductModel");

    }

    

    private updateVisiblePagesCount(): void {
        let iPagesCount: number;
        const screenWidth = window.innerWidth;
    
        if (screenWidth > 1200) {
            iPagesCount = 4; 
        } else if (screenWidth > 768) {
            iPagesCount = 2; 
        } else {
            iPagesCount = 1; 
        }
    
        const oSettingsModel: JSONModel = new JSONModel({ pagesCount: iPagesCount });
        this.getView()?.setModel(oSettingsModel, "settings"); 
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', this.updateVisiblePagesCount.bind(this)); // Listen for resize events
    }
    

    private updateProductList(): void {
        const carousel = this.byId("carouselSample");
        const binding = carousel?.getBinding("pages") as ListBinding;  // Adjust for pages binding
    
        if (binding) {
            binding.refresh(); // Ürün listesini güncelle
        }
    }

    public onExit(): void {
        window.removeEventListener('resize', this.updateVisiblePagesCount.bind(this)); // Olay dinleyicisini kaldır
    }
    

    

    onFilterProducts(event: SearchField$SearchEvent): void {
        const filter = [];
        const query = event.getParameter("query");
        if (query) {
            filter.push(new Filter({
                path: "Name",
                operator: FilterOperator.Contains,
                value1: query,
                caseSensitive: false
            }));
        }
    
        // filter binding
        const carousel = this.byId("carouselSample");
        const binding = carousel?.getBinding("pages") as ListBinding;  // Adjust for pages binding
    
        if (binding) {
            binding.filter(filter);
    
            // Ürün sayısını binding'deki kontekstlerden almak için dataReceived olayını kullanıyoruz
            binding.attachEventOnce("dataReceived", () => {
                const filteredContexts = binding.getContexts(); // Filtrelenmiş ürünleri al
                const productCount = filteredContexts.length;  // Filtrelenmiş ürün sayısı
                console.log(productCount, "search ile filtreleme sonucu");
    
                const oProductCountModel = this.getView()?.getModel("productCountModel") as JSONModel;
                oProductCountModel.setProperty("/productCount", productCount);
            });
        }
    }
    
    onCategoryChange(event: any): void {
        const selectedKey = event.getParameter("selectedItem").getKey();
        const filter = [];
    
        // Eğer "All" seçili değilse filtre uygula
        if (selectedKey !== "All") {
            filter.push(new Filter("MainCategory", FilterOperator.EQ, selectedKey));
        }
    
        // Bind listeye filtreyi uygula
        const carousel = this.byId("carouselSample");
        const binding = carousel?.getBinding("pages") as ListBinding;  // Adjust for pages binding
    
        if (binding) {
            binding.filter(filter);
    
            // Ürün sayısını binding'deki kontekstlerden almak için dataReceived olayını kullanıyoruz
            binding.attachEventOnce("dataReceived", () => {
                const filteredContexts = binding.getContexts(); // Filtrelenmiş ürünleri al
                const productCount = filteredContexts.length;  // Filtrelenmiş ürün sayısı
                console.log(productCount, "select ile filtreleme sonucu");
    
                const oProductCountModel = this.getView()?.getModel("productCountModel") as JSONModel;
                oProductCountModel.setProperty("/productCount", productCount);
            });
        }
    }
    
    

    
    

    public onNumberOfPages(oEvent : any): void {
        const oCarouselCustomLayout = this.byId("carouselSample") as any;
        const sVisiblePageCount = oEvent.getParameter("value");
    
        if (typeof sVisiblePageCount === "string" && oCarouselCustomLayout) {
            oCarouselCustomLayout.setVisiblePagesCount(Number(sVisiblePageCount));
        }
    }
    
    

    public OnScrollModeChange(oEvent: any): void {
        const CarouselScrollMode = library.CarouselScrollMode;
        const bViewMode = oEvent.getParameter("state");
    
        if (typeof bViewMode === "boolean") {
            const sScrollMode = bViewMode ? CarouselScrollMode.VisiblePages : CarouselScrollMode.SinglePage;
            const oCarouselCustomLayout = this.byId("carouselSample") as any;
    
            if (oCarouselCustomLayout) {
                oCarouselCustomLayout.setScrollMode(sScrollMode);
            }
        }
    }

    public onAddProduct(): void {
        this.productActions.onAddProduct();
    }

    public onDeleteProductPress(oEvent: Event): void {
        this.productActions.onDeleteProductPress(oEvent);
    }

    public onIncrease(oEvent: Event): void {
        this.productActions.onIncrease(oEvent);
    }

    public onDecrease(oEvent: Event): void {
        this.productActions.onDecrease(oEvent);
    }

    public addToCart(oEvent: Event): void {
        this.productActions.addToCart(oEvent);
    }

    public onEditProductPress(oEvent: Event): Promise<void> {
        return this.productActions.onEditProductPress(oEvent);
    }

    public onSaveEditProduct(): void {
        this.productActions.onSaveEditProduct();
    }

    // public onCancelEditProduct(): void {
    //     this.productActions.onCancelEditProduct();
    // }
    
   
}
