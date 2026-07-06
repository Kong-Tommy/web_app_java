package com.shop.inventory.entity;

public enum StaffRole {
    ADMIN(1),
    MANAGER(2),
    ANALYST(3),
    OTHER(4);

    private final int code;

    StaffRole(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static StaffRole fromCode(int code) {
        for (StaffRole r : values()) {
            if (r.code == code) {
                return r;
            }
        }
        return OTHER;
    }
}
