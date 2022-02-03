
DROP TABLE IF EXISTS APPLICATION_EVENT_TRACKING;

create table APPLICATION_EVENT_TRACKING (
    /* clé primaire */
    event_id             SERIAL               not null,
    /* le compte qui fait une action */
    uti_maker_id         BIGINT               not null,
    pro_maker_id         BIGINT               not null,
    /* le compte cible d'une action */
    uti_target_id        BIGINT               null,
    pro_target_id        BIGINT               null,
    /* l'objet concerné par l'évènement */
    object_target_id     BIGINT               null,
    object_target_type   VARCHAR(20)          null,
    object_target_name   VARCHAR(30)          null,
    /* action effectuée */
    event_action         VARCHAR(20)          null,
    /* message informatif */
    event_message        TEXT                 null,
    /* date de l'évènement */
    event_date           TIMESTAMP            not null
);

GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE APPLICATION_EVENT_TRACKING TO u_srv_dev;
GRANT USAGE, SELECT, UPDATE ON TABLE APPLICATION_EVENT_TRACKING_EVENT_ID_SEQ TO u_srv_dev;


