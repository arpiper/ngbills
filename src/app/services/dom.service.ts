import { 
  Injectable, 
  Injector, 
  ComponentFactoryResolver, 
  EmbeddedViewRef, 
  ApplicationRef 
} from '@angular/core';

@Injectable()
export class DomService {
  private childCompRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  public appendComponentTo(parentId: string, child: any, config?: childConfig): void {
    // create a component reference from the component
    const childCompRef = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector);

    // attach the config to the child.
    this.attachConfig(config, childCompRef);

    this.childCompRef = childCompRef;

    // attach the component to the appRef.
    this.appRef.attachView(childCompRef.hostView);

    // get DOM element from the component
    const childDomElem = (childCompRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // append DOM element to body
    document.getElementById(parentId).appendChild(childDomElem);
  }

  public removeComponent(): void {
    this.appRef.detachView(this.childCompRef.hostView);
    this.childCompRef.destroy();
  }

  private attachConfig(config, componentRef): void {
    let inputs = config.inputs;
    let outputs = config.outputs;
    for (var key in inputs) {
      componentRef.instance[key] = inputs[key];
    }
    for (var key in outputs) {
      componentRef.instance[key] = outputs[key];
    }
  }
}

interface childConfig {
  inputs: object,
  outputs: object
}
