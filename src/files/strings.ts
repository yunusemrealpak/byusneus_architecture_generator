import { Helpers } from "../helpers/helpers";

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

    public getTestModuleClassString(imports: string, scenarioList: string[]): string {
        let classNameWidget = this.className.charAt(0).toUpperCase() + this.className.slice(1);


        return `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../i_robot.dart';
${imports}

@immutable
final class ${classNameWidget}Robot implements IRobot<${classNameWidget}Robot> {
  final WidgetTester tester;
  const ${classNameWidget}Robot(this.tester);

  @override
  List<Type> get scenarios => [${scenarioList.map(e=> `${e}Scenario`).join(', ')}];

  @override
  Future<void> runScenario(Type scenario) async {
    final scenarioType = scenarios.firstWhere((s) => s == scenario);

    switch (scenarioType) {
      ${scenarioList.map(scenario => `
      case ${scenario}Scenario:
        await ${scenario}Scenario(tester).run();
        break;`).join('')}
    }
  }
}
`;
    }

    public getTestScenarioInterfaceClassString(scenarioName: string): string {
        return `import '../../../i_scenario.dart';

abstract interface class I${scenarioName}Scenario<T> implements IScenario<T> {}
`;
    }

    public getTestScenarioClassString(scenarioName: string): string {
        let snake_name = Helpers.convertToSnakeCase(scenarioName);

        return `import 'package:flutter_test/flutter_test.dart';

import '../../../../utility/test_helper.dart';
import 'i_${snake_name}_scenario.dart';

final class ${scenarioName}Scenario implements I${scenarioName}Scenario<${scenarioName}Scenario> {
  final WidgetTester tester;
  const ${scenarioName}Scenario(this.tester);

  @override
  TestHelper<${scenarioName}Scenario> get helper => TestHelper<${scenarioName}Scenario>(tester);

  @override
  Future<void> run() async {}
}
`;
    }

    public getTestRunnerClassString(moduleName: string, scenarioList: string[]): string {
        let moduleNameClass = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        return `import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import '../robot/${moduleName}/${moduleName}_robot.dart';
import '../utility/test_helper.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('${moduleNameClass} Test Group', () {
    ${scenarioList.map(scenario => `
    testWidgets(
      '${scenario} Test',
      (WidgetTester tester) async {
        await TestHelper<void>(tester).appStart();
        await tester.pumpAndSettle(const Duration(seconds: 1));

        final robot = ${moduleNameClass}Robot(tester);

        // TODO: Add test code here
      },
    );`).join(`\n`)}
  });
}
        `;
    }
}