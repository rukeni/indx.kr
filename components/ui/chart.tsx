'use client';

import type {
  ValueType,
  NameType,
  Payload,
  Formatter,
} from 'recharts/types/component/DefaultTooltipContent';

import * as RechartsPrimitive from 'recharts';
import {
  createContext,
  useContext,
  useMemo,
  useId,
  type ComponentProps,
  type JSX,
  type ReactNode,
  type ComponentType,
} from 'react';

import { cn } from '@internal/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextProps | null>(null);

function useChart(): ChartContextProps {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ComponentProps<'div'> & {
  config: ChartConfig;
  children: ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}): JSX.Element {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}): JSX.Element | null => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;

    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const getFormattedLabel = <TValue extends ValueType, TName extends NameType>(
  labelFormatter:
    | ((value: ReactNode, payload: Payload<TValue, TName>[]) => ReactNode)
    | undefined,
  value: ReactNode,
  payload: Payload<TValue, TName>[],
  labelClassName: string | undefined,
): ReactNode => {
  if (labelFormatter) {
    return (
      <div className={cn('font-medium', labelClassName)}>
        {labelFormatter(value, payload)}
      </div>
    );
  }

  if (!value) {
    return null;
  }

  return <div className={cn('font-medium', labelClassName)}>{value}</div>;
};

type TooltipPayloadItem = {
  dataKey?: string | number;
  name?: string | number;
  payload?: Record<string, unknown>;
  fill?: string;
  color?: string;
  value?: unknown;
};

const getTooltipValue = (
  config: ChartConfig,
  item: TooltipPayloadItem,
  label: ReactNode,
  labelKey: string | undefined,
): ReactNode => {
  const key = `${labelKey || item.dataKey || item.name || 'value'}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);

  return !labelKey && typeof label === 'string'
    ? config[label as keyof typeof config]?.label || label
    : itemConfig?.label;
};

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ComponentProps<typeof RechartsPrimitive.Tooltip> &
  ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }): JSX.Element | null {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const value = getTooltipValue(config, item, label, labelKey);

    return getFormattedLabel(labelFormatter, value, payload, labelClassName);
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <TooltipItem
            key={item.dataKey}
            item={item}
            index={index}
            config={config}
            color={color}
            formatter={formatter}
            indicator={indicator}
            hideIndicator={hideIndicator}
            nestLabel={nestLabel}
            tooltipLabel={tooltipLabel}
            nameKey={nameKey}
          />
        ))}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    hideIcon?: boolean;
    nameKey?: string;
  }): JSX.Element | null {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn(
              '[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3',
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

function getConfigLabelKey(
  payload: unknown,
  payloadPayload: unknown,
  key: string,
): string {
  if (
    typeof payload === 'object' &&
    payload &&
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    return payload[key as keyof typeof payload] as string;
  }

  if (
    payloadPayload &&
    typeof payloadPayload === 'object' &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    return payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return key;
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
): ChartConfig[keyof ChartConfig] | undefined {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload = 'payload' in payload ? payload.payload : undefined;
  const configLabelKey = getConfigLabelKey(payload, payloadPayload, key);

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

type TooltipItemProps = {
  item: Payload<ValueType, NameType>;
  index: number;
  config: ChartConfig;
  color?: string;
  formatter?: Formatter<ValueType, NameType>;
  indicator?: 'line' | 'dot' | 'dashed';
  hideIndicator?: boolean;
  nestLabel?: boolean;
  tooltipLabel?: ReactNode;
  nameKey?: string;
};

const TooltipItem = ({
  item,
  index,
  config,
  color,
  formatter,
  indicator,
  hideIndicator,
  nestLabel,
  tooltipLabel,
  nameKey,
}: TooltipItemProps): ReactNode => {
  const key = `${nameKey || item.name || item.dataKey || 'value'}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = color || item.payload.fill || item.color;

  if (formatter && item?.value !== undefined && item.name) {
    return formatter(item.value, item.name, item, index, item.payload);
  }

  return (
    <TooltipItemContent
      item={item}
      itemConfig={itemConfig}
      indicator={indicator}
      hideIndicator={hideIndicator}
      indicatorColor={indicatorColor}
      nestLabel={nestLabel}
      tooltipLabel={tooltipLabel}
    />
  );
};

const TooltipItemContent = ({
  item,
  itemConfig,
  indicator,
  hideIndicator,
  indicatorColor,
  nestLabel,
  tooltipLabel,
}: Omit<
  TooltipItemProps,
  'index' | 'config' | 'color' | 'formatter' | 'nameKey'
> & {
  itemConfig?: ChartConfig[keyof ChartConfig];
  indicatorColor?: string;
}): JSX.Element => (
  <div
    className={cn(
      '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
      indicator === 'dot' && 'items-center',
    )}
  >
    <TooltipIndicator
      itemConfig={itemConfig}
      hideIndicator={hideIndicator}
      indicator={indicator}
      indicatorColor={indicatorColor}
      nestLabel={nestLabel}
    />
    <TooltipContent
      item={item}
      itemConfig={itemConfig}
      nestLabel={nestLabel}
      tooltipLabel={tooltipLabel}
    />
  </div>
);

type TooltipIndicatorProps = {
  itemConfig?: ChartConfig[keyof ChartConfig];
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  indicatorColor?: string;
  nestLabel?: boolean;
};

const TooltipIndicator = ({
  itemConfig,
  hideIndicator,
  indicator,
  indicatorColor,
}: TooltipIndicatorProps): ReactNode => {
  if (hideIndicator) return null;

  if (itemConfig?.icon) {
    return <itemConfig.icon />;
  }

  return (
    <div
      className={cn(
        'shrink-0',
        indicator === 'line' && 'h-px w-3',
        indicator === 'dot' && 'h-2 w-2 rounded-[2px]',
        indicator === 'dashed' && 'h-px w-3 border-t-2 border-dashed',
      )}
      style={{ backgroundColor: indicatorColor }}
    />
  );
};

type TooltipContentProps = {
  item: Payload<ValueType, NameType>;
  itemConfig?: ChartConfig[keyof ChartConfig];
  nestLabel?: boolean;
  tooltipLabel?: ReactNode;
};

const TooltipContent = ({
  item,
  itemConfig,
  nestLabel,
  tooltipLabel,
}: TooltipContentProps): ReactNode => {
  return (
    <div className="grid gap-1">
      {nestLabel && tooltipLabel}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">
          {itemConfig?.label || item.name}
        </span>
        <span className="font-medium">{item.value}</span>
      </div>
    </div>
  );
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
