package com.zxslsoft.general.apilist;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class MysqlDatabaseResolve {

    private static final String DB_ADDRESS_TEMP = "jdbc:mysql://%s:%s/%s?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&useSSL=false&zeroDateTimeBehavior=convertToNull&generateSimpleParameterMetadata=true&serverTimezone=Asia/Shanghai";

    private String dbaddr;
    private Integer port;
    private String dbName;
    private String user;
    private String password;

    public MysqlDatabaseResolve(
            String ip, Integer port, String dbName,
            String user, String password
    ) {
        try {
            this.dbaddr = String.format(DB_ADDRESS_TEMP, ip, port, dbName);
            this.port = port;
            this.dbName = dbName;
            this.user = user;
            this.password = password;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Map<String, TableInfo> getTableInfoMap() {
        try (
                Connection connection = getConnection();
                PreparedStatement statement = connection.prepareStatement("SELECT\n" +
                        "table_name,\n" +
                        "table_comment\n" +
                        "FROM\n" +
                        "information_schema.TABLES\n" +
                        "WHERE\n" +
                        "table_schema = '"+this.dbName+"'\n" +
                        "ORDER BY\n" +
                        "table_name");
                ResultSet set = statement.executeQuery();
        ) {
            Map<String, TableInfo> ans = new HashMap<>();
            while (set.next()) {
                String tableName = set.getString(1);
                String tableComment = set.getString(2);
                ans.put(tableName, getTableInfo(connection, tableName, tableComment));
            }
            return ans;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private TableInfo getTableInfo(Connection connection, String tableName, String tableComment) {
        try (
                PreparedStatement statement = connection.prepareStatement("SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT from information_schema.COLUMNS WHERE TABLE_NAME='" + tableName + "' AND TABLE_SCHEMA = '" + this.dbName + "'");
                ResultSet set = statement.executeQuery();
        ) {
            TableInfo tableInfo = new TableInfo();
            tableInfo.tableName = tableName;
            tableInfo.comment = tableComment;
            while (set.next()) {
                FieldInfo fieldInfo = new FieldInfo();
                fieldInfo.setName(set.getString("COLUMN_NAME"));
                fieldInfo.setType(set.getString("DATA_TYPE"));
                fieldInfo.setComment(set.getString("COLUMN_COMMENT"));
                tableInfo.fieldInfoList.add(fieldInfo);
            }
            return tableInfo;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Connection getConnection() {
        try {
            return DriverManager.getConnection(this.dbaddr, user, password);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
