<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignement extends Model
{
    use HasFactory;

    protected $table = 'enseignements';
    protected $fillable = [
        'nom_e', 'prenom_e', 'num_carte_national', 'telephone_e', 'id_filieres', 'id_jujjets', 'total_hours','id_user',"id_classe"
    ];

    public function filiere()
    {
        return $this->belongsTo(filieres::class, 'id_filieres');
    }

    public function sujjet()
    {
        return $this->belongsTo(Sujjet::class, 'id_jujjets');
    }

     public function disponibilites()
    {
        return $this->hasMany(salle_diponible::class, 'id_enseignements');
    }
     public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
     public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe');
    }
}