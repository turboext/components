import * as React from 'react';
import { formatTotal } from './utils/number';
import { formatDate } from './utils/date';
import { ICovidInfo } from './commonInterfaces';

import './ExtRbcCovid.scss';

interface IProps {
    'data-date': number;
    'data-info': ICovidInfo;
}

interface IState {
    activeTab: number;
}

export class ExtRbcCovid extends React.PureComponent<IProps, IState> {
    public readonly state = {
        activeTab: 0
    };

    public render(): JSX.Element {
        return (
            <div className="ext-rbc-covid">
                <div className="ext-rbc-covid__date">{formatDate(new Date(this.props['data-date']))}</div>
                <div className="ext-rbc-covid__title">Коронавирус</div>
                <div className="ext-rbc-covid__subtitle" />
                {this.renderTabs()}
                {this.renderContent()}
            </div>
        );
    }

    private handleTabClick = (activeTab: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        this.setState({ activeTab });
    };

    private renderTabs(): JSX.Element {
        const tabs = Object.keys(this.props['data-info']);

        return (
            <div className="ext-rbc-covid__tabs-wrap">
                <div className="ext-rbc-covid__tabs">
                    {tabs.map((tab, index) => {
                        const isActiveTab = index === this.state.activeTab;
                        let className = 'ext-rbc-covid__tabs-item';
                        if (isActiveTab) {
                            className += ' active';
                        }
                        return (
                            <span className={className} key={`tabs-item-${tab}`} onClick={this.handleTabClick(index)}>
                                {tab}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }

    private renderContent(): JSX.Element {
        const tabs = Object.keys(this.props['data-info']);

        const contents = tabs.map((tab, index) => {
            const isActiveContent = index === this.state.activeTab;
            const content = this.props['data-info'][tab];
            let className = 'ext-rbc-covid__content';
            if (isActiveContent) {
                className += ' active';
            }
            return (
                <div className={className} key={`content-${tab}`}>
                    <div className="ext-rbc-covid__stats">
                        <div className="ext-rbc-covid__stats-per-day">
                            <span className="ext-rbc-covid__stats-count ext-rbc-covid__stats-count--grow">
                                {content.recovered.perDay}
                            </span>
                            <span className="ext-rbc-covid__stats-hint">(за сутки)</span>
                        </div>
                        <div className="ext-rbc-covid__stats-total">{formatTotal(content.recovered.total)}</div>
                        <div className="ext-rbc-covid__stats-text">Выздоровели</div>
                    </div>
                    <div className="ext-rbc-covid__stats">
                        <div className="ext-rbc-covid__stats-per-day">
                            <span className="ext-rbc-covid__stats-count">{content.infected.perDay}</span>
                            <span className="ext-rbc-covid__stats-hint">(за сутки)</span>
                        </div>
                        <div className="ext-rbc-covid__stats-total">{formatTotal(content.infected.total)}</div>
                        <div className="ext-rbc-covid__stats-text">Заразились</div>
                    </div>
                    <div className="ext-rbc-covid__stats">
                        <div className="ext-rbc-covid__stats-per-day">
                            <span className="ext-rbc-covid__stats-count ext-rbc-covid__stats-count--fail">
                                {content.died.perDay}
                            </span>
                            <span className="ext-rbc-covid__stats-hint">(за сутки)</span>
                        </div>
                        <div className="ext-rbc-covid__stats-total">{formatTotal(content.died.total)}</div>
                        <div className="ext-rbc-covid__stats-text">Умерли</div>
                    </div>
                </div>
            );
        });

        return (
            <div className="ext-rbc-covid__content-wrap">
                {contents}
                <div className="ext-rbc-covid__source">
                    Источник: JHU,
                    <br />
                    федеральный и региональные
                    <br />
                    оперштабы по борьбе с вирусом
                </div>
            </div>
        );
    }
}
