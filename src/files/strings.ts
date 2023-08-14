export class Strings {
    className: string;

    constructor(className: string) {
        this.className = className;
    }

    public  get getInfrastructureClassString(): string {
        let classNameWidget = this.className.charAt(0).toUpperCase() + this.className.slice(1);
        return `import 'package:injectable/injectable.dart';
import '../../_domain/${this.className}/i_${this.className}_repository.dart';
import '../../_domain/network/app_network_manager.dart';

@LazySingleton(as: I${classNameWidget}Repository)
class ${classNameWidget}Repository implements I${classNameWidget}Repository {
  final AppNetworkManager manager;
  ${classNameWidget}Repository(this.manager);
}`;
    }

    public  get getApplicationStateClassString(): string {
        let classNameWidget = this.className.charAt(0).toUpperCase() + this.className.slice(1);
        return `import 'package:busenet/busenet.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import '../core/base_state.dart';

part '${this.className}_state.freezed.dart';

@freezed
class ${classNameWidget}State extends BaseState with _$${classNameWidget}State {
  const factory ${classNameWidget}State({
    @Default(false) bool isLoading,
    Failure? failure,
  }) = _${classNameWidget}State;
  factory ${classNameWidget}State.initial() => const ${classNameWidget}State();
}`;
    }

    public  get getApplicationCubitClassString(): string {
        let classNameWidget = this.className.charAt(0).toUpperCase() + this.className.slice(1);
        return `import 'package:injectable/injectable.dart';

import '../core/base_cubit.dart';
import '${this.className}_state.dart';

@injectable
final class ${classNameWidget}Cubit extends BaseCubit<${classNameWidget}State> {
    ${classNameWidget}Cubit() : super(${classNameWidget}State.initial());

  void init() {}

  @override
  void setLoading(bool loading) {
    safeEmit(state.copyWith(isLoading: loading));
  }
}
        `;
    }

    public  get getPresentationClassString(): string {
        let classNameWidget = this.className.charAt(0).toUpperCase() + this.className.slice(1);
        return `import 'package:flutter/material.dart';
import '../../_application/${this.className}/${this.className}_cubit.dart';
import '../../_application/${this.className}/${this.className}_state.dart';

import '../_core/base_view.dart';

class ${classNameWidget}View extends StatelessWidget {
  const ${classNameWidget}View({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseView<${classNameWidget}Cubit, ${classNameWidget}State>(
      onCubitReady: (cubit) {
        cubit.setContext(context);
      },
      builder: (context, ${classNameWidget}Cubit cubit, ${classNameWidget}State state) {
        return Scaffold(
          appBar: AppBar(
            title: const Text(''),
          ),
          body: Container(),
        );
      },
    );
  }
}
        `;
    }

    public  get getDomainClassString(): string {
        let classNameWidget = this.className.charAt(0).toUpperCase() + this.className.slice(1);
        return `
import '../../_common/classes/typedef.dart';

abstract interface class I${classNameWidget}Repository {}
`;
    }
}