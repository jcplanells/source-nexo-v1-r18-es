@echo off
echo =========================================
echo Ghost Theme Builder - Source (Windows)
echo =========================================

:: Paso 1: Verifica si estás en la carpeta del theme
IF NOT EXIST "package.json" (
    echo Este script debe ejecutarse desde la carpeta raíz del tema.
    pause
    exit /b
)
echo.

:: Paso 2: Ejecutar build sin modo watch
echo Ejecutando: npx gulp build
call npx gulp build
IF %ERRORLEVEL% NEQ 0 (
    echo Error al ejecutar 'gulp build'
    pause
    exit /b
)
echo.

:: Paso 3: Crear el ZIP del theme
echo Empaquetando el tema: npx gulp zip
call npx gulp zip
IF %ERRORLEVEL% NEQ 0 (
    echo Error al ejecutar 'gulp zip'
    pause
    exit /b
)
echo.

:: Paso 4: Asigna versión del tema
echo Renombrando archivo zip
copy dist\source-nexo-v1-preview.zip dist\source-nexo-v16-preview.zip
echo.

:: Fin
echo Tema compilado y empaquetado con exito.
echo Verifica la carpeta dist\ para encontrar el ZIP listo para subir a Ghost(Pro)

