import { css } from '@emotion/css';
import React from 'react';

import { Field, GrafanaTheme2, LinkModel } from '@grafana/data';
import { Button, ButtonProps, DataLinkButton, HorizontalGroup, useStyles2 } from '@grafana/ui';
import { ADD_ANNOTATION_ID } from '@grafana/ui/src/components/uPlot/utils';

interface VizTooltipFooterProps {
  dataLinks: Array<LinkModel<Field>>;
  canAnnotate: boolean;
}

export const VizTooltipFooter = ({ dataLinks, canAnnotate }: VizTooltipFooterProps) => {
  const styles = useStyles2(getStyles);

  const renderDataLinks = () => {
    const buttonProps: ButtonProps = {
      variant: 'secondary',
    };

    return (
      <HorizontalGroup>
        {dataLinks.map((link, i) => (
          <DataLinkButton key={i} link={link} buttonProps={buttonProps} />
        ))}
      </HorizontalGroup>
    );
  };

  return (
    <div className={styles.wrapper}>
      {dataLinks.length > 0 && <div className={styles.dataLinks}>{renderDataLinks()}</div>}
      {canAnnotate && (
        <div className={styles.addAnnotations}>
          <Button icon="comment-alt" variant="secondary" size="sm" id={ADD_ANNOTATION_ID}>
            Add annotation
          </Button>
        </div>
      )}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  }),
  dataLinks: css({
    height: 40,
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    borderTop: `1px solid ${theme.colors.border.medium}`,
    maskImage: 'linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, transparent)',
  }),
  addAnnotations: css({
    borderTop: `1px solid ${theme.colors.border.medium}`,
    paddingTop: theme.spacing(1),
  }),
});
