(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/router'), require('@angular/animations'), require('rxjs'), require('@angular/material/core'), require('@angular/material/icon'), require('@angular/material/list')) :
    typeof define === 'function' && define.amd ? define('ng-material-multilevel-menu', ['exports', '@angular/common', '@angular/core', '@angular/router', '@angular/animations', 'rxjs', '@angular/material/core', '@angular/material/icon', '@angular/material/list'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng-material-multilevel-menu'] = {}, global.ng.common, global.ng.core, global.ng.router, global.ng.animations, global.rxjs, global.ng.material.core, global.ng.material.icon, global.ng.material.list));
}(this, (function (exports, common, core, router, animations, rxjs, core$1, icon, list) { 'use strict';

    (function (ExpandCollapseStatusEnum) {
        ExpandCollapseStatusEnum["expand"] = "expand";
        ExpandCollapseStatusEnum["collapse"] = "collapse";
        ExpandCollapseStatusEnum["neutral"] = "neutral";
    })(exports.ExpandCollapseStatusEnum || (exports.ExpandCollapseStatusEnum = {}));

    var CONSTANT = {
        PADDING_AT_START: true,
        DEFAULT_CLASS_NAME: "amml-container",
        DEFAULT_LIST_CLASS_NAME: "amml-item",
        SELECTED_LIST_CLASS_NAME: "selected-amml-item",
        ACTIVE_ITEM_CLASS_NAME: "active-amml-item",
        DISABLED_ITEM_CLASS_NAME: "disabled-amml-item",
        DEFAULT_SELECTED_FONT_COLOR: "#1976d2",
        DEFAULT_LIST_BACKGROUND_COLOR: "transparent",
        DEFAULT_LIST_FONT_COLOR: "rgba(0,0,0,.87)",
        DEFAULT_HREF_TARGET_TYPE: '_self',
        ERROR_MESSAGE: "Invalid data for material Multilevel List Component"
    };

    var MultilevelMenuService = /** @class */ (function () {
        function MultilevelMenuService() {
            this.expandCollapseStatus = new rxjs.Subject();
            this.expandCollapseStatus$ = this.expandCollapseStatus.asObservable();
            this.selectedMenuID = new rxjs.Subject();
            this.selectedMenuID$ = this.selectedMenuID.asObservable();
        }
        MultilevelMenuService.prototype.generateId = function () {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 20; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        MultilevelMenuService.prototype.addRandomId = function (nodes) {
            var _this = this;
            nodes.forEach(function (node) {
                node.id = _this.generateId();
                if (node.items !== undefined) {
                    _this.addRandomId(node.items);
                }
            });
        };
        MultilevelMenuService.prototype.recursiveCheckId = function (node, nodeId) {
            var _this = this;
            if (node.id === nodeId) {
                return true;
            }
            else {
                if (node.items !== undefined) {
                    return node.items.some(function (nestedNode) {
                        return _this.recursiveCheckId(nestedNode, nodeId);
                    });
                }
            }
        };
        MultilevelMenuService.prototype.findNodeRecursively = function (_a) {
            var nodes = _a.nodes, link = _a.link, id = _a.id;
            for (var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
                var node = nodes[nodeIndex];
                for (var key in node) {
                    if (node.hasOwnProperty(key)) {
                        if (encodeURI(node.link) === link) {
                            this.foundLinkObject = node;
                        }
                        else if (node.id === id) {
                            this.foundLinkObject = node;
                        }
                        else {
                            if (node.items !== undefined) {
                                this.findNodeRecursively({
                                    nodes: node.items,
                                    link: link ? link : null,
                                    id: id ? id : null
                                });
                            }
                        }
                    }
                }
            }
        };
        MultilevelMenuService.prototype.getMatchedObjectByUrl = function (nodes, link) {
            this.findNodeRecursively({ nodes: nodes, link: link });
            return this.foundLinkObject;
        };
        MultilevelMenuService.prototype.getMatchedObjectById = function (nodes, id) {
            console.log(nodes, id);
            this.findNodeRecursively({ nodes: nodes, id: id });
            return this.foundLinkObject;
        };
        // overrides key-value pipe's default reordering (by key) by implementing dummy comprarer function
        // https://angular.io/api/common/KeyValuePipe#description
        MultilevelMenuService.prototype.kvDummyComparerFn = function () {
            return 0;
        };
        MultilevelMenuService.prototype.setMenuExapandCollpaseStatus = function (status) {
            this.expandCollapseStatus.next(status ? status : exports.ExpandCollapseStatusEnum.neutral);
        };
        MultilevelMenuService.prototype.selectMenuByID = function (menuID) {
            this.selectedMenuID.next(menuID);
            return this.foundLinkObject;
        };
        return MultilevelMenuService;
    }());

    var ListItemComponent = /** @class */ (function () {
        function ListItemComponent(router, multilevelMenuService) {
            var _a;
            this.router = router;
            this.multilevelMenuService = multilevelMenuService;
            this.level = 1;
            this.submenuLevel = 0;
            this.nodeConfiguration = null;
            this.nodeExpandCollapseStatus = null;
            this.selectedItem = new core.EventEmitter();
            this.isSelected = false;
            this.expanded = false;
            this.firstInitializer = false;
            this.selectedListClasses = (_a = {},
                _a[CONSTANT.DEFAULT_LIST_CLASS_NAME] = true,
                _a[CONSTANT.SELECTED_LIST_CLASS_NAME] = false,
                _a[CONSTANT.ACTIVE_ITEM_CLASS_NAME] = false,
                _a);
        }
        ListItemComponent.prototype.ngOnChanges = function () {
            this.nodeChildren = this.node && this.node.items ? this.node.items.filter(function (n) { return !n.hidden; }) : [];
            if (this.selectedNode !== undefined && this.selectedNode !== null) {
                this.setSelectedClass(this.multilevelMenuService.recursiveCheckId(this.node, this.selectedNode.id));
            }
            this.setExpandCollapseStatus();
        };
        ListItemComponent.prototype.ngOnInit = function () {
            this.selectedListClasses[CONSTANT.DISABLED_ITEM_CLASS_NAME] = this.node.disabled;
            if (this.node.faIcon !== null &&
                this.node.faIcon !== undefined &&
                this.node.faIcon.match(/\bfa\w(?!-)/) === null) {
                this.node.faIcon = "fas " + this.node.faIcon;
            }
            this.selectedListClasses["level-" + this.level + "-submenulevel-" + this.submenuLevel] = true;
            if (typeof this.node.expanded === 'boolean') {
                this.expanded = this.node.expanded;
            }
            this.setClasses();
        };
        ListItemComponent.prototype.setSelectedClass = function (isFound) {
            var _a;
            if (isFound) {
                if (!this.firstInitializer) {
                    this.expanded = true;
                }
                this.isSelected = this.nodeConfiguration.highlightOnSelect || this.selectedNode.items === undefined ? true : false;
            }
            else {
                this.isSelected = false;
                if (this.nodeConfiguration.collapseOnSelect) {
                    this.expanded = false;
                }
            }
            this.selectedListClasses = (_a = {},
                _a[CONSTANT.DEFAULT_LIST_CLASS_NAME] = true,
                _a[CONSTANT.SELECTED_LIST_CLASS_NAME] = this.isSelected,
                _a[CONSTANT.ACTIVE_ITEM_CLASS_NAME] = this.selectedNode.id === this.node.id,
                _a[CONSTANT.DISABLED_ITEM_CLASS_NAME] = this.node.disabled,
                _a["level-" + this.level + "-submenulevel-" + this.submenuLevel] = true,
                _a);
            this.setClasses();
        };
        ListItemComponent.prototype.getPaddingAtStart = function () {
            return this.nodeConfiguration.paddingAtStart ? true : false;
        };
        ListItemComponent.prototype.getListStyle = function () {
            var styles = {
                background: CONSTANT.DEFAULT_LIST_BACKGROUND_COLOR,
                color: CONSTANT.DEFAULT_LIST_FONT_COLOR
            };
            if (this.nodeConfiguration.listBackgroundColor !== null) {
                styles.background = this.nodeConfiguration.listBackgroundColor;
            }
            if (this.isSelected) {
                this.nodeConfiguration.selectedListFontColor !== null ?
                    styles.color = this.nodeConfiguration.selectedListFontColor : styles.color = CONSTANT.DEFAULT_SELECTED_FONT_COLOR;
            }
            else if (this.nodeConfiguration.fontColor !== null) {
                styles.color = this.nodeConfiguration.fontColor;
            }
            return styles;
        };
        ListItemComponent.prototype.getListIcon = function (node) {
            if (node.icon !== null && node.icon !== undefined && node.icon !== '') {
                return "icon";
            }
            else if (node.faIcon !== null && node.faIcon !== undefined && node.faIcon !== '') {
                return "faicon";
            }
            else if (node.imageIcon !== null && node.imageIcon !== undefined && node.imageIcon !== '') {
                return "imageicon";
            }
            else if (node.svgIcon !== null && node.svgIcon !== undefined && node.svgIcon !== '') {
                return "svgicon";
            }
            else {
                return "";
            }
        };
        ListItemComponent.prototype.getSelectedSvgIcon = function () {
            if (this.isSelected && this.node.activeSvgIcon) {
                return this.node.activeSvgIcon;
            }
            return this.node.svgIcon;
        };
        ListItemComponent.prototype.getSelectedIcon = function () {
            if (this.isSelected && this.node.activeIcon) {
                return this.node.activeIcon;
            }
            return this.node.icon;
        };
        ListItemComponent.prototype.getSelectedFaIcon = function () {
            if (this.isSelected && this.node.activeFaIcon) {
                return this.node.activeFaIcon;
            }
            return this.node.faIcon;
        };
        ListItemComponent.prototype.getSelectedImageIcon = function () {
            if (this.isSelected && this.node.activeImageIcon) {
                return this.node.activeImageIcon;
            }
            return this.node.imageIcon;
        };
        ListItemComponent.prototype.getHrefTargetType = function () {
            if (this.node.hrefTargetType) {
                return this.node.hrefTargetType;
            }
            return CONSTANT.DEFAULT_HREF_TARGET_TYPE;
        };
        ListItemComponent.prototype.hasItems = function () {
            return this.nodeChildren.length > 0 ? true : false;
        };
        ListItemComponent.prototype.isRtlLayout = function () {
            return this.nodeConfiguration.rtlLayout;
        };
        ListItemComponent.prototype.setClasses = function () {
            var _a;
            this.classes = (_a = {},
                _a["level-" + (this.level + 1)] = true,
                _a['amml-submenu'] = this.hasItems() && this.getPaddingAtStart(),
                _a);
        };
        ListItemComponent.prototype.setExpandCollapseStatus = function () {
            if (this.nodeExpandCollapseStatus !== null && this.nodeExpandCollapseStatus !== undefined) {
                if (this.nodeExpandCollapseStatus === exports.ExpandCollapseStatusEnum.expand) {
                    this.expanded = true;
                }
                if (this.nodeExpandCollapseStatus === exports.ExpandCollapseStatusEnum.collapse) {
                    this.expanded = false;
                }
            }
        };
        ListItemComponent.prototype.expand = function (node) {
            if (node.disabled) {
                return;
            }
            this.nodeExpandCollapseStatus = exports.ExpandCollapseStatusEnum.neutral;
            this.expanded = !this.expanded;
            this.firstInitializer = true;
            this.setClasses();
            if (this.nodeConfiguration.interfaceWithRoute !== null
                && this.nodeConfiguration.interfaceWithRoute
                && node.link !== undefined
                && node.link) {
                this.router.navigate([node.link], node.navigationExtras);
            }
            else if (node.onSelected && typeof node.onSelected === 'function') {
                node.onSelected(node);
                this.selectedListItem(node);
            }
            else if (node.items === undefined || this.nodeConfiguration.collapseOnSelect) {
                this.selectedListItem(node);
            }
        };
        ListItemComponent.prototype.selectedListItem = function (node) {
            this.selectedItem.emit(node);
        };
        return ListItemComponent;
    }());
    ListItemComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ng-list-item',
                    template: "<mat-list-item matRipple \n  *ngIf=\"!node.hidden\"\n  title=\"{{node.label}}\"\n  [matRippleDisabled]=\"node.disabled\" \n  [ngClass]=\"selectedListClasses\"\n  [ngStyle]=\"getListStyle()\"\n  (click)=\"expand(node)\">\n  <ng-container *ngTemplateOutlet=\"linkTemplate\"></ng-container>\n</mat-list-item>\n\n<mat-divider *ngIf=\"nodeConfiguration.useDividers\"></mat-divider>\n\n<div *ngIf=\"hasItems() && expanded\" [@slideInOut] [dir]=\"isRtlLayout() ? 'rtl' : 'ltr'\" [ngClass]=\"classes\">\n  <ng-list-item *ngFor=\"let singleNode of nodeChildren | keyvalue : multilevelMenuService.kvDummyComparerFn\"\n    [nodeConfiguration]='nodeConfiguration' \n    [node]=\"singleNode.value\" \n    [level]=\"level + 1\"\n    [submenuLevel]=\"singleNode.key\"\n    [selectedNode]='selectedNode' \n    [nodeExpandCollapseStatus]='nodeExpandCollapseStatus'\n    (selectedItem)=\"selectedListItem($event)\">\n  </ng-list-item>\n</div>\n\n<ng-template #linkTemplate>\n  <a class=\"anml-link\" *ngIf=\"node.externalRedirect\" [href]=\"node.link\" [target]=\"getHrefTargetType()\">\n    <ng-container *ngTemplateOutlet=\"linkLabelOutlet\"></ng-container>\n  </a>\n  <a class=\"anml-link\" *ngIf=\"!node.externalRedirect\" [routerLink]=\"node.link\">\n    <ng-container *ngTemplateOutlet=\"linkLabelOutlet\"></ng-container>\n  </a>\n</ng-template>\n\n<ng-template #linkLabelOutlet>\n  <div class=\"anml-data\" [dir]=\"isRtlLayout() ? 'rtl' : 'ltr'\">\n    <div class=\"icon-container\" [ngSwitch]=\"getListIcon(node)\">\n      <span *ngSwitchCase=\"'faicon'\" class=\"amml-icon amml-icon-fa\">\n        <i [ngClass]=\"getSelectedFaIcon()\"></i>\n      </span>\n      <mat-icon *ngSwitchCase=\"'icon'\" class=\"amml-icon\">\n        {{getSelectedIcon()}}\n      </mat-icon>\n      <mat-icon *ngSwitchCase=\"'svgicon'\" svgIcon=\"{{getSelectedSvgIcon()}}\" class=\"amml-icon amml-svg-icon\">\n      </mat-icon>\n      <img matListAvatar *ngSwitchCase=\"'imageicon'\" class=\"amml-icon\" src=\"{{getSelectedImageIcon()}}\"\n        alt=\"{{node.label}}\" />\n    </div>\n    <span class=\"label\">{{node.label}}</span>\n  </div>\n  <div class=\"amml-icon-arrow-container\" *ngIf='hasItems()'>\n    <mat-icon *ngIf='!isRtlLayout()' [@isExpandedLTR]=\"expanded ? 'yes' : 'no'\">\n      keyboard_arrow_down\n    </mat-icon>\n    <mat-icon *ngIf='isRtlLayout()' [@isExpandedRTL]=\"expanded ? 'yes' : 'no'\">\n      keyboard_arrow_down\n    </mat-icon>\n  </div>\n</ng-template>",
                    animations: [
                        animations.trigger('slideInOut', [
                            animations.state('in', animations.style({ height: '*', opacity: 0 })),
                            animations.transition(':leave', [
                                animations.style({ height: '*', opacity: 0.2 }),
                                animations.group([
                                    animations.animate(200, animations.style({ height: 0 })),
                                    animations.animate('200ms ease-out', animations.style({ opacity: 0 }))
                                ])
                            ]),
                            animations.transition(':enter', [
                                animations.style({ height: '0', opacity: 0 }),
                                animations.group([
                                    animations.animate(200, animations.style({ height: '*' })),
                                    animations.animate('400ms ease-out', animations.style({ opacity: 1 }))
                                ])
                            ])
                        ]),
                        animations.trigger('isExpandedLTR', [
                            animations.state('no', animations.style({ transform: 'rotate(-90deg)' })),
                            animations.state('yes', animations.style({ transform: 'rotate(0deg)', })),
                            animations.transition('no => yes', animations.animate(200)),
                            animations.transition('yes => no', animations.animate(200))
                        ]),
                        animations.trigger('isExpandedRTL', [
                            animations.state('no', animations.style({ transform: 'rotate(90deg)' })),
                            animations.state('yes', animations.style({ transform: 'rotate(0deg)', })),
                            animations.transition('no => yes', animations.animate(200)),
                            animations.transition('yes => no', animations.animate(200))
                        ])
                    ],
                    styles: [".amml-item{cursor:pointer;line-height:48px;position:relative}.anml-link{color:inherit;text-decoration:none;text-transform:capitalize}.anml-data,.anml-link{display:flex;justify-content:flex-start;width:100%}.anml-data{height:48px}.disabled-amml-item{opacity:.5;pointer-events:none;text-decoration:none}.icon-container{display:flex;flex-direction:column;justify-content:center}.amml-icon-fa{font-size:20px}.label{font-weight:400;line-height:48px}.amml-svg-icon{height:22px;margin-top:-12px;width:22px}.amml-icon-arrow-container{align-items:center;direction:ltr;display:flex}div[dir=ltr] .amml-icon{margin-right:16px}div[dir=ltr].amml-submenu,div[dir=rtl] .amml-icon{margin-left:16px}div[dir=rtl].amml-submenu{margin-right:16px}"]
                },] }
    ];
    ListItemComponent.ctorParameters = function () { return [
        { type: router.Router },
        { type: MultilevelMenuService }
    ]; };
    ListItemComponent.propDecorators = {
        node: [{ type: core.Input }],
        level: [{ type: core.Input }],
        submenuLevel: [{ type: core.Input }],
        selectedNode: [{ type: core.Input }],
        nodeConfiguration: [{ type: core.Input }],
        nodeExpandCollapseStatus: [{ type: core.Input }],
        selectedItem: [{ type: core.Output }]
    };

    var MaterialsModule = /** @class */ (function () {
        function MaterialsModule() {
        }
        return MaterialsModule;
    }());
    MaterialsModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        icon.MatIconModule,
                        list.MatListModule,
                        core$1.MatRippleModule,
                    ],
                    declarations: [],
                    exports: [
                        icon.MatIconModule,
                        list.MatListModule,
                        core$1.MatRippleModule,
                    ]
                },] }
    ];

    var NgMaterialMultilevelMenuComponent = /** @class */ (function () {
        function NgMaterialMultilevelMenuComponent(router, multilevelMenuService) {
            this.router = router;
            this.multilevelMenuService = multilevelMenuService;
            this.configuration = null;
            this.selectedItem = new core.EventEmitter();
            this.selectedLabel = new core.EventEmitter();
            this.expandCollapseStatusSubscription = null;
            this.selectMenuByIDSubscription = null;
            this.nodeConfig = {
                paddingAtStart: true,
                listBackgroundColor: null,
                fontColor: null,
                selectedListFontColor: null,
                interfaceWithRoute: null,
                collapseOnSelect: null,
                highlightOnSelect: false,
                useDividers: true,
                rtlLayout: false,
            };
            this.isInvalidConfig = true;
            this.nodeExpandCollapseStatus = exports.ExpandCollapseStatusEnum.neutral;
        }
        NgMaterialMultilevelMenuComponent.prototype.ngOnChanges = function () {
            this.detectInvalidConfig();
            this.initExpandCollapseStatus();
            this.initSelectedMenuID();
        };
        NgMaterialMultilevelMenuComponent.prototype.ngOnInit = function () {
            var _this = this;
            if (this.configuration !== null && this.configuration !== undefined && this.configuration !== '' &&
                this.configuration.interfaceWithRoute !== null && this.configuration.interfaceWithRoute) {
                this.router.events
                    .subscribe(function (event) {
                    if (event instanceof router.NavigationEnd) {
                        _this.updateNodeByURL(event.urlAfterRedirects);
                    }
                });
                this.updateNodeByURL(this.router.url);
            }
        };
        NgMaterialMultilevelMenuComponent.prototype.updateNodeByURL = function (url) {
            var foundNode = this.multilevelMenuService.getMatchedObjectByUrl(this.items, url);
            if (foundNode !== undefined &&
                foundNode.link !== undefined &&
                foundNode.link !== null &&
                foundNode.link !== ''
            // && !foundNode.disabled // Prevent route redirection for disabled menu
            ) {
                this.currentNode = foundNode;
                if (foundNode.dontEmit !== undefined && foundNode.dontEmit !== null && !foundNode.dontEmit) {
                    this.selectedListItem(foundNode);
                }
            }
        };
        NgMaterialMultilevelMenuComponent.prototype.checkValidData = function () {
            if (this.items.length === 0) {
                console.warn(CONSTANT.ERROR_MESSAGE);
            }
            else {
                this.items = this.items.filter(function (n) { return !n.hidden; });
                this.multilevelMenuService.addRandomId(this.items);
            }
        };
        NgMaterialMultilevelMenuComponent.prototype.detectInvalidConfig = function () {
            if (this.configuration === null || this.configuration === undefined || this.configuration === '') {
                this.isInvalidConfig = true;
            }
            else {
                this.isInvalidConfig = false;
                var config = this.configuration;
                if (config.paddingAtStart !== undefined && config.paddingAtStart !== null && typeof config.paddingAtStart === 'boolean') {
                    this.nodeConfig.paddingAtStart = config.paddingAtStart;
                }
                if (config.listBackgroundColor !== '' &&
                    config.listBackgroundColor !== null &&
                    config.listBackgroundColor !== undefined) {
                    this.nodeConfig.listBackgroundColor = config.listBackgroundColor;
                }
                if (config.fontColor !== '' &&
                    config.fontColor !== null &&
                    config.fontColor !== undefined) {
                    this.nodeConfig.fontColor = config.fontColor;
                }
                if (config.selectedListFontColor !== '' &&
                    config.selectedListFontColor !== null &&
                    config.selectedListFontColor !== undefined) {
                    this.nodeConfig.selectedListFontColor = config.selectedListFontColor;
                }
                if (config.interfaceWithRoute !== null &&
                    config.interfaceWithRoute !== undefined &&
                    typeof config.interfaceWithRoute === 'boolean') {
                    this.nodeConfig.interfaceWithRoute = config.interfaceWithRoute;
                }
                if (config.collapseOnSelect !== null &&
                    config.collapseOnSelect !== undefined &&
                    typeof config.collapseOnSelect === 'boolean') {
                    this.nodeConfig.collapseOnSelect = config.collapseOnSelect;
                }
                if (config.highlightOnSelect !== null &&
                    config.highlightOnSelect !== undefined &&
                    typeof config.highlightOnSelect === 'boolean') {
                    this.nodeConfig.highlightOnSelect = config.highlightOnSelect;
                }
                if (config.useDividers !== null &&
                    config.useDividers !== undefined &&
                    typeof config.useDividers === 'boolean') {
                    this.nodeConfig.useDividers = config.useDividers;
                }
                if (config.rtlLayout !== null &&
                    config.rtlLayout !== undefined &&
                    typeof config.rtlLayout === 'boolean') {
                    this.nodeConfig.rtlLayout = config.rtlLayout;
                }
            }
            this.checkValidData();
        };
        NgMaterialMultilevelMenuComponent.prototype.initExpandCollapseStatus = function () {
            var _this = this;
            this.expandCollapseStatusSubscription = this.multilevelMenuService.expandCollapseStatus$.subscribe(function (expandCollapseStatus) {
                _this.nodeExpandCollapseStatus = expandCollapseStatus ? expandCollapseStatus : exports.ExpandCollapseStatusEnum.neutral;
            }, function () {
                _this.nodeExpandCollapseStatus = exports.ExpandCollapseStatusEnum.neutral;
            });
        };
        NgMaterialMultilevelMenuComponent.prototype.initSelectedMenuID = function () {
            var _this = this;
            this.selectMenuByIDSubscription = this.multilevelMenuService.selectedMenuID$.subscribe(function (selectedMenuID) {
                if (selectedMenuID) {
                    var foundNode = _this.multilevelMenuService.getMatchedObjectById(_this.items, selectedMenuID);
                    console.log(selectedMenuID, foundNode);
                    if (foundNode !== undefined) {
                        _this.currentNode = foundNode;
                        // this.selectedListItem(foundNode);
                    }
                }
            });
        };
        NgMaterialMultilevelMenuComponent.prototype.getClassName = function () {
            if (this.isInvalidConfig) {
                return CONSTANT.DEFAULT_CLASS_NAME;
            }
            else {
                if (this.configuration.classname !== '' && this.configuration.classname !== null && this.configuration.classname !== undefined) {
                    return CONSTANT.DEFAULT_CLASS_NAME + " " + this.configuration.classname;
                }
                else {
                    return CONSTANT.DEFAULT_CLASS_NAME;
                }
            }
        };
        NgMaterialMultilevelMenuComponent.prototype.getGlobalStyle = function () {
            if (!this.isInvalidConfig) {
                var styles = {
                    background: null
                };
                if (this.configuration.backgroundColor !== '' &&
                    this.configuration.backgroundColor !== null &&
                    this.configuration.backgroundColor !== undefined) {
                    styles.background = this.configuration.backgroundColor;
                }
                return styles;
            }
        };
        NgMaterialMultilevelMenuComponent.prototype.isRtlLayout = function () {
            return this.nodeConfig.rtlLayout;
        };
        NgMaterialMultilevelMenuComponent.prototype.selectedListItem = function (event) {
            this.nodeExpandCollapseStatus = exports.ExpandCollapseStatusEnum.neutral;
            this.currentNode = event;
            if (event.dontEmit !== undefined && event.dontEmit !== null && event.dontEmit) {
                return;
            }
            if (event.items === undefined && (!event.onSelected || typeof event.onSelected !== 'function')) {
                this.selectedItem.emit(event);
            }
            else {
                this.selectedLabel.emit(event);
            }
        };
        NgMaterialMultilevelMenuComponent.prototype.ngOnDestroy = function () {
            this.expandCollapseStatusSubscription.unsubscribe();
            this.selectMenuByIDSubscription.unsubscribe();
        };
        return NgMaterialMultilevelMenuComponent;
    }());
    NgMaterialMultilevelMenuComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ng-material-multilevel-menu',
                    template: "<div [ngClass]=\"getClassName()\" [ngStyle]=\"getGlobalStyle()\" *ngIf='items.length !== 0' [dir]=\"isRtlLayout() ? 'rtl' : 'ltr'\">\n  <mat-list>\n    <ng-list-item\n      *ngFor=\"let node of items | keyvalue: multilevelMenuService.kvDummyComparerFn\"\n      [nodeConfiguration]='nodeConfig'\n      [node]='node.value'\n      [level]=\"1\"\n      [submenuLevel]=\"node.key\"\n      [selectedNode]='currentNode'\n      [nodeExpandCollapseStatus]='nodeExpandCollapseStatus'\n      (selectedItem)=\"selectedListItem($event)\n    \">\n    </ng-list-item>\n  </mat-list>\n</div>\n",
                    styles: [".amml-container .mat-list-base{padding-top:unset}.amml-item{display:flex;justify-content:space-between;line-height:48px;position:relative}.anml-data{display:flex;justify-content:flex-start;text-transform:capitalize;width:100%}.amml-icon-fa{font-size:20px}.amml-icon{line-height:48px}.active{color:#1976d2}div[dir=ltr] .amml-icon{margin-right:15px}div[dir=ltr] .amml-submenu{margin-left:16px}div[dir=rtl] .amml-icon{margin-left:15px}div[dir=rtl] .amml-submenu{margin-right:16px}"]
                },] }
    ];
    NgMaterialMultilevelMenuComponent.ctorParameters = function () { return [
        { type: router.Router },
        { type: MultilevelMenuService }
    ]; };
    NgMaterialMultilevelMenuComponent.propDecorators = {
        items: [{ type: core.Input }],
        configuration: [{ type: core.Input }],
        selectedItem: [{ type: core.Output }],
        selectedLabel: [{ type: core.Output }]
    };

    var NgMaterialMultilevelMenuModule = /** @class */ (function () {
        function NgMaterialMultilevelMenuModule() {
        }
        return NgMaterialMultilevelMenuModule;
    }());
    NgMaterialMultilevelMenuModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        MaterialsModule,
                        router.RouterModule,
                    ],
                    declarations: [
                        NgMaterialMultilevelMenuComponent,
                        ListItemComponent,
                    ],
                    exports: [NgMaterialMultilevelMenuComponent]
                },] }
    ];

    /*
     * Public API Surface of ng-material-multilevel-menu
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MultilevelMenuService = MultilevelMenuService;
    exports.NgMaterialMultilevelMenuComponent = NgMaterialMultilevelMenuComponent;
    exports.NgMaterialMultilevelMenuModule = NgMaterialMultilevelMenuModule;
    exports.ɵa = MaterialsModule;
    exports.ɵb = ListItemComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-material-multilevel-menu.umd.js.map
