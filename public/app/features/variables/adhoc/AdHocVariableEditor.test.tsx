import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ComponentProps } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { mockDataSource } from 'app/features/alerting/unified/mocks';
import { DataSourceType } from 'app/features/alerting/unified/utils/datasource';

import { adHocBuilder } from '../shared/testing/builders';

import { AdHocVariableEditorUnConnected as AdHocVariableEditor } from './AdHocVariableEditor';

const promDsMock = mockDataSource({
  name: 'Prometheus',
  type: DataSourceType.Prometheus,
});

const lokiDsMock = mockDataSource({
  name: 'Loki',
  type: DataSourceType.Loki,
});

jest.mock('@grafana/runtime/src/services/dataSourceSrv', () => {
  return {
    getDataSourceSrv: () => ({
      get: () => {
        return Promise.resolve(promDsMock);
      },
      getList: () => [promDsMock, lokiDsMock],
      getInstanceSettings: (v: string) => {
        if (v === 'Prometheus') {
          return promDsMock;
        }
        return lokiDsMock;
      },
    }),
  };
});

const props = {
  extended: {
    dataSources: [
      { text: 'Prometheus', value: null }, // default datasource
      { text: 'Loki', value: { type: 'loki-ds', uid: 'abc' } },
    ],
  } as ComponentProps<typeof AdHocVariableEditor>['extended'],
  variable: adHocBuilder().withId('adhoc').withRootStateKey('key').withName('adhoc').build(),
  onPropChange: jest.fn(),

  // connected actions
  initAdHocVariableEditor: jest.fn(),
  changeVariableDatasource: jest.fn(),
};

describe('AdHocVariableEditor', () => {
  beforeEach(() => {
    props.changeVariableDatasource.mockReset();
  });

  it('has a datasource select menu', async () => {
    render(<AdHocVariableEditor {...props} />);

    expect(await screen.getByTestId(selectors.components.DataSourcePicker.container)).toBeInTheDocument();
  });

  it('calls the callback when changing the datasource', async () => {
    render(<AdHocVariableEditor {...props} />);
    const selectEl = screen
      .getByTestId(selectors.components.DataSourcePicker.container)
      .getElementsByTagName('input')[0];
    await userEvent.click(selectEl);
    await userEvent.click(screen.getByText('Loki'));

    expect(props.changeVariableDatasource).toBeCalledWith(
      { type: 'adhoc', id: 'adhoc', rootStateKey: 'key' },
      { type: 'loki', uid: 'mock-ds-3' }
    );
  });

  it('renders informational text', () => {
    const extended = {
      ...props.extended,
      infoText: "Here's a message that should help you",
    };
    render(<AdHocVariableEditor {...props} extended={extended} />);

    const alert = screen.getByText("Here's a message that should help you");
    expect(alert).toBeInTheDocument();
  });
});
