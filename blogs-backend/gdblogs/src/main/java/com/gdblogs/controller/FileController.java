package com.gdblogs.controller;

import com.gdblogs.annotation.AuthCheck;
import com.gdblogs.common.BaseResponse;
import com.gdblogs.common.ResultUtils;
import com.gdblogs.constant.UserConstant;
import com.gdblogs.exception.BusinessException;
import com.gdblogs.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 文件上传接口
 */
@RestController
@RequestMapping("/file")
@Slf4j
public class FileController {

    // 文件存储路径（项目根目录下的 uploads/images/）
    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * 上传图片
     *
     * @param file 图片文件
     * @return 图片访问 URL
     */
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    @PostMapping("/upload/image")
    public BaseResponse<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文件为空");
        }

        // 校验文件类型
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "只能上传图片");
        }

        // 校验文件大小（5MB）
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "图片大小不能超过5MB");
        }

        try {
            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "文件名为空");
            }
            
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }
            
            String filename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + extension;

            // 确保目录存在
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                boolean created = folder.mkdirs();
                if (!created) {
                    throw new BusinessException(ErrorCode.SYSTEM_ERROR, "创建上传目录失败");
                }
            }

            // 保存文件
            File dest = new File(folder, filename);
            file.transferTo(dest.getAbsoluteFile());

            log.info("文件保存成功: {}", dest.getAbsolutePath());
            // 返回访问 URL
            String url = "/uploads/images/" + filename;
            log.info("文件上传成功: {}", url);
            return ResultUtils.success(url);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "上传失败");
        }
    }
}

