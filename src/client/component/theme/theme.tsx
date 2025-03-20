import React from 'react';
import Typography from '@mui/material/Typography';

import css from './theme.module.css';

export type ThemeProps = {
  children?: never;
};

export const Theme: React.FC<ThemeProps> = () => (
  <div className={css.theme}>
    <div className={css.colors}>
      <div className={css.commonBlack}>common.black</div>
      <div className={css.commonWhite}>common.white</div>
      <div className={css.primaryLight}>primary.light</div>
      <div className={css.primaryMain}>primary.main</div>
      <div className={css.primaryDark}>primary.dark</div>
      <div className={css.secondaryLight}>secondary.light</div>
      <div className={css.secondaryMain}>secondary.main</div>
      <div className={css.secondaryDark}>secondary.dark</div>
      <div className={css.errorLight}>error.light</div>
      <div className={css.errorMain}>error.main</div>
      <div className={css.errorDark}>error.dark</div>
      <div className={css.warningLight}>warning.light</div>
      <div className={css.warningMain}>warning.main</div>
      <div className={css.warningDark}>warning.dark</div>
      <div className={css.infoLight}>info.light</div>
      <div className={css.infoMain}>info.main</div>
      <div className={css.infoDark}>info.dark</div>
      <div className={css.successLight}>success.light</div>
      <div className={css.successMain}>success.main</div>
      <div className={css.successDark}>success.dark</div>
      <div className={css.grey50}>50</div>
      <div className={css.grey100}>100</div>
      <div className={css.grey200}>200</div>
      <div className={css.grey300}>300</div>
      <div className={css.grey400}>400</div>
      <div className={css.grey500}>500</div>
      <div className={css.grey600}>600</div>
      <div className={css.grey700}>700</div>
      <div className={css.grey800}>800</div>
      <div className={css.grey900}>900</div>
      <div className={css.greyA100}>A100</div>
      <div className={css.greyA200}>A200</div>
      <div className={css.greyA400}>A400</div>
      <div className={css.greyA700}>A700</div>
      <div className={css.backgroundPaper}>background.paper</div>
      <div className={css.backgroundDefault}>background.default</div>
      <div className={css.divider}>divider</div>
      <div className={css.actionActive}>action.active</div>
      <div className={css.actionHover}>action.hover</div>
      <div className={css.actionSelected}>action.selected</div>
      <div className={css.actionDisabled}>action.disabled</div>
      <div className={css.actionDisabledBackground}>action.disabledBackground</div>
      <div className={css.actionFocus}>action.focus</div>
    </div>
    <div className={css.typography}>
      <Typography variant="h1">h1</Typography>
      <Typography variant="h2">h2</Typography>
      <Typography variant="h3">h3</Typography>
      <Typography variant="h4">h4</Typography>
      <Typography variant="h5">h5</Typography>
      <Typography variant="h6">h6</Typography>
      <Typography variant="subtitle1">subtitle1</Typography>
      <Typography variant="subtitle2">subtitle2</Typography>
      <Typography variant="body1">body1</Typography>
      <Typography variant="body2">body2</Typography>
      <Typography variant="button">button</Typography>
      <Typography variant="caption">caption</Typography>
      <Typography variant="overline">overline</Typography>
    </div>
  </div>
);
