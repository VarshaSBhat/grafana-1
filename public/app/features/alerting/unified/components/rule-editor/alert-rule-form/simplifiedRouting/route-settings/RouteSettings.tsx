import { css } from '@emotion/css';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { GrafanaTheme2 } from '@grafana/data';
import {
  Field,
  FieldValidationMessage,
  InlineField,
  InputControl,
  MultiSelect,
  Stack,
  Switch,
  Text,
  useStyles2,
} from '@grafana/ui';
import { MultiValueRemove } from '@grafana/ui/src/components/Select/MultiValue';
import { RuleFormValues } from 'app/features/alerting/unified/types/rule-form';
import {
  commonGroupByOptions,
  mapMultiSelectValueToStrings,
  stringToSelectableValue,
  stringsToSelectableValues,
} from 'app/features/alerting/unified/utils/amroutes';

import { getFormStyles } from '../../../../notification-policies/formStyles';
import { TIMING_OPTIONS_DEFAULTS } from '../../../../notification-policies/timingOptions';

import { RouteTimings } from './RouteTimings';

export interface RoutingSettingsProps {
  alertManager: string;
}
export const RoutingSettings = ({ alertManager }: RoutingSettingsProps) => {
  const formStyles = useStyles2(getFormStyles);
  const {
    control,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RuleFormValues>();
  const [groupByOptions, setGroupByOptions] = useState(stringsToSelectableValues([]));
  const { groupIntervalValue, groupWaitValue, repeatIntervalValue } = getDefaultsForRoutingSettings();
  const overrideGrouping = watch(`contactPoints.${alertManager}.overrideGrouping`);
  const overrideTimings = watch(`contactPoints.${alertManager}.overrideTimings`);
  const requiredFieldsInGroupBy = useMemo(() => ['grafana_folder', 'alertname'], []);
  const styles = useStyles2(getStyles);
  useEffect(() => {
    if (overrideGrouping && watch(`contactPoints.${alertManager}.groupBy`)?.length === 0) {
      setValue(`contactPoints.${alertManager}.groupBy`, requiredFieldsInGroupBy);
    }
  }, [overrideGrouping, requiredFieldsInGroupBy, setValue, alertManager, watch]);

  return (
    <Stack direction="column">
      <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
        <InlineField label="Override grouping" transparent={true} className={styles.switchElement}>
          <Switch id="override-grouping-toggle" {...register(`contactPoints.${alertManager}.overrideGrouping`)} />
        </InlineField>
        {!overrideGrouping && (
          <Text variant="body" color="secondary">
            Grouping: <strong>{requiredFieldsInGroupBy.join(', ')}</strong>
          </Text>
        )}
      </Stack>
      {overrideGrouping && (
        <Field
          label="Group by"
          description="Group alerts when you receive a notification based on labels. If empty it will be inherited from the default notification policy."
          {...register(`contactPoints.${alertManager}.groupBy`)}
          invalid={!!errors.contactPoints?.[alertManager]?.groupBy}
          className={styles.optionalContent}
        >
          <InputControl
            rules={{
              validate: (value: string[]) => {
                if (!value || value.length === 0) {
                  return 'At least one group by option is required.';
                }
                return true;
              },
            }}
            render={({ field: { onChange, ref, ...field }, fieldState: { error } }) => (
              <>
                <MultiSelect
                  aria-label="Group by"
                  {...field}
                  allowCustomValue
                  className={formStyles.input}
                  onCreateOption={(opt: string) => {
                    setGroupByOptions((opts) => [...opts, stringToSelectableValue(opt)]);

                    // @ts-ignore-check: react-hook-form made me do this
                    setValue(`contactPoints.${alertManager}.groupBy`, [...field.value, opt]);
                  }}
                  onChange={(value) => {
                    return onChange(mapMultiSelectValueToStrings(value));
                  }}
                  options={[...commonGroupByOptions, ...groupByOptions]}
                  components={{
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    MultiValueRemove(props: any) {
                      const { data } = props;
                      if (data.isFixed) {
                        return null;
                      }
                      return MultiValueRemove(props);
                    },
                  }}
                />
                {error && <FieldValidationMessage>{error.message}</FieldValidationMessage>}
              </>
            )}
            name={`contactPoints.${alertManager}.groupBy`}
            control={control}
          />
        </Field>
      )}
      <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
        <InlineField label="Override timings" transparent={true} className={styles.switchElement}>
          <Switch id="override-timings-toggle" {...register(`contactPoints.${alertManager}.overrideTimings`)} />
        </InlineField>
        {!overrideTimings && (
          <Text variant="body" color="secondary">
            Group wait: <strong>{groupWaitValue}, </strong>
            Group interval: <strong>{groupIntervalValue}, </strong>
            Repeat interval: <strong>{repeatIntervalValue}</strong>
          </Text>
        )}
      </Stack>
      {overrideTimings && (
        <div className={styles.optionalContent}>
          <RouteTimings alertManager={alertManager} />
        </div>
      )}
    </Stack>
  );
};

function getDefaultsForRoutingSettings() {
  return {
    groupWaitValue: TIMING_OPTIONS_DEFAULTS.group_wait,
    groupIntervalValue: TIMING_OPTIONS_DEFAULTS.group_interval,
    repeatIntervalValue: TIMING_OPTIONS_DEFAULTS.repeat_interval,
  };
}

const getStyles = (theme: GrafanaTheme2) => ({
  switchElement: css({
    flexFlow: 'row-reverse',
    gap: theme.spacing(1),
    alignItems: 'center',
  }),
  optionalContent: css({
    marginLeft: '49px',
    marginBottom: theme.spacing(1),
  }),
});
