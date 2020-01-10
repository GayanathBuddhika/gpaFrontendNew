'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">pulsebeat-v2 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-56a60d154c2aab970997f93397169165"' : 'data-target="#xs-components-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-56a60d154c2aab970997f93397169165"' :
                                            'id="xs-components-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsideNavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AsideNavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BranchAddComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BranchAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BranchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BranchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BranchDepartFormationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BranchDepartFormationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BranchListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BranchListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompanyAddComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompanyAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompanyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompanyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompanyListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompanyListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompanyListDropdownComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompanyListDropdownComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DepartmentAddComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DepartmentAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DepartmentAssignToBranchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DepartmentAssignToBranchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DepartmentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DepartmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DepartmentListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DepartmentListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeAddComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmployeeAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmployeeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmployeeListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FieldErrorDisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FieldErrorDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterNavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterNavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageNotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsNavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsNavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubscriptionAddComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubscriptionAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubscriptionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubscriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubscriptionListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubscriptionListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubscriptionPlanComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubscriptionPlanComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubscriptionPlanListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubscriptionPlanListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopNavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TopNavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserAddComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-56a60d154c2aab970997f93397169165"' : 'data-target="#xs-directives-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-56a60d154c2aab970997f93397169165"' :
                                        'id="xs-directives-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                        <li class="link">
                                            <a href="directives/DropzoneDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">DropzoneDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-56a60d154c2aab970997f93397169165"' : 'data-target="#xs-injectables-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-56a60d154c2aab970997f93397169165"' :
                                        'id="xs-injectables-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ErrorDisplayService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ErrorDisplayService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-56a60d154c2aab970997f93397169165"' : 'data-target="#xs-pipes-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-56a60d154c2aab970997f93397169165"' :
                                            'id="xs-pipes-links-module-AppModule-56a60d154c2aab970997f93397169165"' }>
                                            <li class="link">
                                                <a href="pipes/CamelCasePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CamelCasePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FileSizePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FileSizePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterBranchPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterBranchPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' : 'data-target="#xs-components-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' :
                                            'id="xs-components-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' }>
                                            <li class="link">
                                                <a href="components/SigninComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SigninComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' : 'data-target="#xs-injectables-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' :
                                        'id="xs-injectables-links-module-AuthModule-8afb4b3e777536043a7468090e0ba4c7"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link">AuthRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Branch.html" data-type="entity-link">Branch</a>
                            </li>
                            <li class="link">
                                <a href="classes/BussinessType.html" data-type="entity-link">BussinessType</a>
                            </li>
                            <li class="link">
                                <a href="classes/Company.html" data-type="entity-link">Company</a>
                            </li>
                            <li class="link">
                                <a href="classes/CompanyBranchDepartment.html" data-type="entity-link">CompanyBranchDepartment</a>
                            </li>
                            <li class="link">
                                <a href="classes/Department.html" data-type="entity-link">Department</a>
                            </li>
                            <li class="link">
                                <a href="classes/DepToBranch.html" data-type="entity-link">DepToBranch</a>
                            </li>
                            <li class="link">
                                <a href="classes/Employee.html" data-type="entity-link">Employee</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorDisplayBaseComponent.html" data-type="entity-link">ErrorDisplayBaseComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdName.html" data-type="entity-link">IdName</a>
                            </li>
                            <li class="link">
                                <a href="classes/Plan.html" data-type="entity-link">Plan</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionsDetails.html" data-type="entity-link">SubscriptionsDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BranchService.html" data-type="entity-link">BranchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BussinessTypeService.html" data-type="entity-link">BussinessTypeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CompanyService.html" data-type="entity-link">CompanyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DepartmentAssingToBranchService.html" data-type="entity-link">DepartmentAssingToBranchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DepartmentService.html" data-type="entity-link">DepartmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmployeeService.html" data-type="entity-link">EmployeeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorDisplayService.html" data-type="entity-link">ErrorDisplayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlanService.html" data-type="entity-link">PlanService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubscriptionService.html" data-type="entity-link">SubscriptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/HttpConfigInterceptor.html" data-type="entity-link">HttpConfigInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/UnauthorizedInterceptor.html" data-type="entity-link">UnauthorizedInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ImageDetails.html" data-type="entity-link">ImageDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Note.html" data-type="entity-link">Note</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectItem.html" data-type="entity-link">SelectItem</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});