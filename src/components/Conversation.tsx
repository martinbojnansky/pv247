import * as React from 'react';
import { StoreState } from '../models/StoreState';
import './../styles/Conversation.css';
import Channel from './../models/Channel';
import MessageComposer from './../containers/MessageComposer';
import { MessageListItem } from './../components/MessageListItem';
import * as actions from './../actions/Actions';
import Message from '../models/Message';
import { Member } from '../models/Member';

export interface ConversationProps {
    isConversationDataLoaded: boolean;
    channel?: Channel;
    messages: Message[];
    members: {[id: string]: Member};
    currentUserId: string;
}

export interface ConversationDispatch {
    onGetMessages: (channelId: string, scrollToEnd: boolean, showErrors: boolean) => Promise<actions.Action>;
    onRenameChannel: (channel: Channel) => Promise<actions.Action>;
    onInviteMemberToChannel: (channel: Channel) => Promise<actions.Action>;
    onDeleteChannel: (channelId: string) => Promise<actions.Action>;
    onVoteMessage: (channelId: string, message: Message, userId: string, isPositive: boolean) => Promise<actions.Action>;
    onDeleteMessage: (channelId: string, messageId: string) => Promise<actions.Action>;
}

export default class Conversation extends React.Component<ConversationProps & ConversationDispatch, StoreState> {
    componentWillMount() {
        setInterval(
            () => {
                if (this.props.channel) {
                    this.props.onGetMessages(this.props.channel.id, false, false);
                }
            }, 
            2000);
    }
    
    render() {
        return (
            <div className="conversation">
                {/* actions */}
                <div className="conversation-header bg-light">
                    <span className="conversation-title">
                        {(this.props.channel) ? this.props.channel.name : ''}
                    </span>
                    {getActions(this.props)}
                </div>
                {/* messages */}
                <div id="conversation-detail" className="conversation-detail">
                    <div className="message-list" onChange={() => { alert('change'); }}>
                        {getMessagesList(this.props)}
                    </div>
                </div>
                {/* composer */}
                <div className="conversation-composer bg-light">
                    <MessageComposer/>
                </div>
            </div>
        );
    }
}

function getActions(props: ConversationProps & ConversationDispatch) {
    return (
        <div className="conversation-actions dropdown">
        <button 
            className="btn btn-secondary dropdown-toggle" 
            type="button"
            disabled={!props.channel}
        />            
        <div className="dropdown-menu">
            <button 
                className="dropdown-item"
                onClick={() => { 
                    if (props.channel) { props.onGetMessages(props.channel.id, true, true); }}}
            >
                Refresh
            </button>
            <button 
                className="dropdown-item"
                onClick={() => { 
                    if (props.channel) { props.onInviteMemberToChannel(props.channel); }}}
            >
                Invite
            </button>
            <div className="dropdown-divider"/>
            <button 
                className="dropdown-item"
                onClick={() => {
                    if (props.channel) { props.onRenameChannel(props.channel); }}}
                disabled={!isOwner(props)}
            >
                Rename
            </button>
            <button 
                className="dropdown-item"
                onClick={() => {
                    if (props.channel) { props.onDeleteChannel(props.channel.id); }}}
                disabled={!isOwner(props)}
            >
                Delete
            </button>
        </div>
    </div>
    );
}

function isOwner(props: ConversationProps & ConversationDispatch): boolean {
    return (props.channel && props.channel.customData.owner === props.currentUserId) 
        ? true 
        : false;
}

function getMessagesList(props: ConversationProps & ConversationDispatch) {
    return props.messages.map(function(message: Message) {
        return (
            <MessageListItem             
                key={message.id}
                message={message}
                owner={props.members[message.createdBy]}
                currentUserId={props.currentUserId}
                onUpVote={() => { 
                    if (props.channel) { 
                        props.onVoteMessage(props.channel.id, message, props.currentUserId, true); 
                    }
                }}
                onDownVote={() => { 
                    if (props.channel) { 
                      props.onVoteMessage(props.channel.id, message, props.currentUserId, false); 
                    }
                }}
                onDelete={() => { 
                    if (props.channel) {
                        props.onDeleteMessage(props.channel.id, message.id); 
                    }
                }}
            />
        );
    });
}