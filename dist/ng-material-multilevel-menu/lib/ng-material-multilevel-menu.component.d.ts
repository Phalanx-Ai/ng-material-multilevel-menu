import { OnChanges, OnInit, OnDestroy, EventEmitter, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackgroundStyle, Configuration, MultilevelNodes, ExpandCollapseStatusEnum } from './app.model';
import { MultilevelMenuService } from './multilevel-menu.service';
export declare class NgMaterialMultilevelMenuComponent implements OnInit, OnChanges, OnDestroy {
    private router;
    multilevelMenuService: MultilevelMenuService;
    items: MultilevelNodes[];
    configuration: Configuration;
    selectedItem: EventEmitter<MultilevelNodes>;
    selectedLabel: EventEmitter<MultilevelNodes>;
    listTemplate: TemplateRef<ElementRef>;
    expandCollapseStatusSubscription: Subscription;
    selectMenuByIDSubscription: Subscription;
    currentNode: MultilevelNodes;
    nodeConfig: Configuration;
    isInvalidConfig: boolean;
    isInvalidData: boolean;
    nodeExpandCollapseStatus: ExpandCollapseStatusEnum;
    constructor(router: Router, multilevelMenuService: MultilevelMenuService);
    ngOnChanges(): void;
    ngOnInit(): void;
    updateNodeByURL(url: string): void;
    checkValidData(): void;
    detectInvalidConfig(): void;
    initExpandCollapseStatus(): void;
    initSelectedMenuID(): void;
    getClassName(): string;
    getGlobalStyle(): BackgroundStyle;
    isRtlLayout(): boolean;
    selectedListItem(event: MultilevelNodes): void;
    ngOnDestroy(): void;
}
